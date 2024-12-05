<div>
    {#if $gains['roll']}
        {#each $gains['roll'] as g}
        <span class='pr-1'>
            <img src='
            {g == 1 ? one :
            g == 2 ? two :
            g == 3 ? three :
            g == 4 ? four :
            g == 5 ? five :
            six}' class='w-6 h-6 inline-block' alt='dice roll'>
        </span>
        {/each}
    {/if}
</div>
<div class='grid pb-2 font-bold text-sm'>
    {#if $gains['resGain'] > 0}
        <span class='text-green-500'>Success! ({f($gains['diceTotal'])}) &nbsp;
            <span class='{$rarityColors[cap($gains['rarity'] || '')] || 'text-slate-700'} font-bold text-sm col-span-3'>
                +{f($gains['resGain'])} {$gains['rarity'] && $gains['rarity'] != 'regular' ? cap($gains['rarity']) : ''}
                {$gains['resource'] || ''}&nbsp;
            </span> &nbsp;
        </span>
    {:else if $gains['diceTotal']}
        <span class=' font-bold text-red-600 text-sm'>
            Failure ({f($gains['diceTotal'])}) &nbsp;
            <span class='{$rarityColors[cap($gains['rarity'] || '')] || 'text-slate-700'} font-bold text-sm col-span-3'>
                [req {$gains['thresh']}]
            </span>
        </span>
    {/if}
    {#if $gains['skillXP']}
        <span class='pb-2 font-bold text-sm col-span-3'>
            <span class='text-sm text-fuchsia-500 font-bold col-span-3'>
                + {f($gains['skillXP'],2)} XP
            </span> &nbsp;
            <span class='text-sm text-sky-600 font-bold col-span-3'>
                + {f($gains['masteryXP'], 2)} XP
            </span>
        </span>
    {/if}
    {#if $gains['skillLU']}
        <div class='text-sm text-fuchsia-500 font-bold col-span-3'>
            + {cap($actionType)} level up! ({$skillXP['level']})
        </div>
    {/if}
    {#if $gains['masteryLU']}
    <div class='text-sm text-sky-600 font-bold col-span-3'>
        + Mastery level up! ({$masteryXP['level']})
    </div>
    {/if}
    {#if $gains['proficiencyLU']}
    <div class='text-sm text-violet-500 font-bold col-span-3'>
        + {cap($gains['resource'])} proficiency increased! ({$gains['proficiencyLevel'] || 'N/A'})
    </div>
    {:else}
    <div class='text-sm text-violet-500 font-bold col-span-3'>
        Proficiency {$gains['proficiencyLevel'] || 'N/A'} [{f($gains['totalResProficiency'])} / {f($proficiencyValues[$gains['nextProficiencyLevel'] || 1] || 0)}]
    </div>
    {/if}
    {#if $gains && ($gains['bonuses'] || []).length > 0}
    <div class='col-span-2 text-sm'> 
        {#each $gains['bonuses'] as b}
        <div class='{$genWalletColors[b['type']]}'>
            <strong>+ {f(b['total'])} {b['type']}</strong> 
                ({f(b['base'])} + {f(b['bonus'])})
        </div>
        {/each}
    </div>
    {/if}


</div>

<script lang='ts'>
     import {actionType, actionsOn, actionPrep, actionPrepReload,
    refreshingActions, actionsLeft} from '../../../lib/data/state';
    import {sc} from '../../../lib/data/socket';
    import {onMount, onDestroy} from 'svelte';
    import {currArea, skillXP, masteryXP,
         genWallet, skillWallet, gains} from '../../../lib/data/player';
    import {areasStore, rarityThresholdsStore, 
        rarityNamesStore, raritySelectedStore, 
        rarityColors, genWalletColors, proficiencyValues} from '../../../lib/data/game';
    import {f, fp} from '../../../lib/formatting';

    import one from '$lib/images/dice/one.svg';
    import two from '$lib/images/dice/two.svg';
    import three from '$lib/images/dice/three.svg';
    import four from '$lib/images/dice/four.svg';
    import five from '$lib/images/dice/five.svg';
    import six from '$lib/images/dice/six.svg';


    const cap = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
</script>


