<script lang="ts">
    import {sc} from '../../../lib/data/socket';
    import {onMount, onDestroy} from 'svelte';
    import {lastAction, refreshingActions, tab, loaded} from '../../../lib/data/state';
    import {resourceNames, marketListings} from '../../../lib/data/game';
    import {actionsOn, actionPrep, actionType, actionPrepReload} from '../../../lib/data/state';
    import {masteryXP, gains, genWallet, 
        skillWallet, skillLevels, skillXP, currArea,
    wallets, gatheringWallet, merchantryWallet, userID, username} from '../../../lib/data/player';
    import {updateInventory} from '../../../lib/data/flags';
    import axios from 'axios';
    import {goto} from '$app/navigation';
    import {io} from 'socket.io-client'
    
    let nextAction = Date.now();
    $: nextTime = nextAction - getTime;
    let pbarw = 0;

    let invDbFetchClock = 0;
    
    const getTime = Date.now();
    
    onMount(() => {
            // wait for socket to connect
        const socket = io('http://localhost:3000', {
                    upgrade: false,
                    transports: ['websocket']
                })
        $sc = socket;
        $sc.on('get-all-wallets-return', (res: any) => {
                    console.log('wallet!')
                    if (res.miningWallet) $wallets['mining'] = res.miningWallet;
                    if (res.gatheringWallet) $wallets['gathering'] = res.gatheringWallet;
                    if (res.merchantryWallet) $wallets['merchantry'] = res.merchantryWallet;
                    if (res.genWallet) $genWallet = res.genWallet;
                    $updateInventory = true;
                    console.log($genWallet)
                    console.log(res.genWallet)
                })

        $sc.on('return-ui-init', (res: any) => {
            $genWallet = res.genWallet;
            $wallets['mining'] = res.miningWallet;
            $wallets['gathering'] = res.gatheringWallet;
            $masteryXP = res.masteryXP;
            $skillLevels = res.skillLevels;
            console.log($skillLevels)
            })
        

            $sc.on('update-ui-values', (res: any) => {
                $genWallet = res.data.genWallet;
                $skillWallet = res.data.skillWallet;
                $masteryXP = res.data.masteryXP;
                $skillXP = res.data.skillXP;
                console.log($masteryXP)
            })

            $sc.on('connect-fetch-confirm', (data: JSON) => {
                console.log(data.message)
                $sc.room
                    $actionType = data['actionType'];
                    if (data['actionsLeft'] > 0) $actionsOn = true;
                    else $actionsOn = false;
                    
                    if (data['loading']) {
                        $actionPrep = true;
                        $actionPrepReload = true;
                    } 
                    else $actionPrep = false;                    
                    $loaded['area'] = true
                    $loaded['rarity'] = true
                })

            $sc.on('connect', (data: JSON) => {
                    console.log('connected to socket')
                })

            $sc.on('action-start-confirm', (context: JSON) => {
                    console.log('action started')
                    $actionPrep = true;
                    $actionsOn = true;
                    $loaded['area'] = true
                    $loaded['rarity'] = true
                    invDbFetchClock = 9;
                    
                })
            
                $sc.on('action-tick', (context: JSON) => {      
                    //console.log('tick')
                    $actionsOn = true;
                    if (context['actionType']) {
                        $actionType = context['actionType'];
                    }
                    if ($actionPrep) {
                        $actionPrep = false;
                    }
                    if ($actionPrepReload) {
                        $actionPrepReload = false;
                    }
                    nextAction = context['time'] + context['interval']
                    // set next action time
                    //@ts-ignor
           // console.log(context)
                    $refreshingActions = false;
                    $actionType = context['actionType'];
                    if (!$currArea) {
                        $currArea = context['currentArea']
                    }
                    $genWallet = context['genWallet'];
                    $sc.emit('action-tick-writeback', 
                    {
                        context: context
                    }) // any writeback that's needed goes here

                    // update client-side inventory, occasionally fetch from db
                    if ($tab == 'inventory') {
                        $updateInventory = true;
                    }

                    //$sc.emit('get-all-wallets', {})
                })


                $sc.on('action-tick-gains', (gains: any) => {
                    $gains = gains.data;
                    console.log($gains)
                    invDbFetchClock++;
                    if (invDbFetchClock > 9) {
                        $sc.emit('get-all-wallets', {})
                        invDbFetchClock = 0;
                    } else {
                        console.log('manual update...')
                        const resGain = $gains['resGain'] || 0;
                        const resource = $gains['resource'];
                        const atype = $actionType.toLowerCase()
                        $wallets[atype][resource] = ($wallets[atype][resource] || 0) + resGain;
                        $wallets[atype]['total'+resource] = ($wallets[atype]['total'+resource] || 0) + resGain;
                        console.log(resource, $wallets[atype][resource], resGain)
                          
                    }
                    
                    // temp update wallet with bonuses
                    // if ($gains['bonuses']) {
                    //     $gains['bonuses'].forEach((bonus: any) => {
                    //         $genWallet[bonus['type']] = ($genWallet[bonus['type']] || 0) + bonus['total'];
                    //     })
                    // }
                })

                $sc.on('action-end-confirm', (context: JSON) => {
                   // console.log('action ended')
                    $actionsOn = false;
                    $actionPrep = false;
                })

                $sc.on('fetch-resource-names-return', (res: any) => {
                    $resourceNames['mining'] = res.resNames.mining || [];
                    $resourceNames['gathering'] = res.resNames.gathering || [];
                    $resourceNames['merchantry'] = res.resNames.merchantry || [];
                    $resourceNames['gen'] = res.resNames.gen || [];
                })

                $sc.on('fetch-all-market-listings-return', (res: any) => {
                    $marketListings = res.listings;
                })

                setTimeout(() => {
                    $sc.emit('connect-fetch', {})
                    $sc.emit('ui-init', {})
                    $sc.emit('get-all-wallets', {})
                }, 1000)
        })

    

    $: user = ''

    onMount(() => {
        setTimeout(() => {
            try {
                console.log('socket created')

                $sc.on('connect', () => {
                    console.log('connected to socket!')
                    // console.log('emitting connection event')
                    // $sc.emit('connect-test', {})
                })

                $sc.on('logout', () => {
                    logout();
                })
                
                $sc.on("connect_error", (err: any) => {
                    console.log(`connect_error due to ${err.message}`);
            //console.log(err)
                });
                getInfo().then((data) => {
                    user = data.username
                    $username = data.username
                    $userID = data.userID
                })
        } catch (err) {
            console.log(err)
        }
        }, 400)
    })


    const testAction = () => {
        if (actionsOn) {
            actionsOff()
            return;
        }
        $actionsOn = true
        $sc.emit('action-start', {})
    }

    let emitter: any;
    const actions = () => {
        emitter = setInterval(() => {
            console.log('testing...')
            $sc.emit('action', {action: 'test'})
        }, 1000)
    }

    const actionsOff = () => {
        $actionsOn = false
        $sc.emit('action-end', {})
        clearInterval(emitter)
    }

    onDestroy(() => {
        if ($sc) $sc.disconnect()
        clearInterval(emitter)
    })

    const getInfo = async () => {
        const user_info = await axios.get('http://localhost:3000/get_user', {withCredentials: true});
        if (user_info.data.err === 'nosession') {
            console.log('no authorization')
            goto('/login')
        }
        if (user_info.data.err === 'noauth') {
            console.log('no authorization')
            goto('/login')
        }
        return {
            username: user_info.data.username,
            userID: user_info.data.userID
        };
    }

    const logout = async () => {
        const logout = await axios.get('http://localhost:3000/logout', {withCredentials: true});
        goto('/login')
    }
    </script>