
<!-- dice displays -->
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
    <span class='font-bold align-middle mb-1 text-xl'>+ {$gains['skillBonus']}</span>
{/if}
</div>
<div class='grid grid-cols-3'>
    <div class='col-span-1'>
        {#if $gains}
            {#if $gains['resGain'] > 0}
            <div class='pb-1 font-bold text-green-500 text-md col-span-3'>
                Roll success! Total: {$gains['diceTotal']}
            </div>
            {:else}
            <div class='pb-1 font-bold text-red-600 text-md col-span-3'>
                Roll failed. Total: {$gains['diceTotal']} ({($gains['roll'] || []).reduce((a, b) => a + b, 0)} + {$gains['skillBonus']})
            </div>
            {/if}
            {#if $gains['resGain'] > 0}
                <div class='text-md {$rarityColors[cap($gains['rarity'] || '')] || 'text-slate-700'} font-bold col-span-3'>
                    + {f($gains['resGain'])} {$gains['rarity'] && $gains['rarity'] != 'regular' ? cap($gains['rarity']) : ''}
                    {cap($gains['resource']) || ''}
                </div>
            {:else}
                <div class='text-md'>&nbsp;</div>
            {/if}
            <div class='text-sm text-fuchsia-500 font-bold col-span-3'>
                + {f($gains['skillXP'],2)} {$gains['actionType']} XP
            </div>
            <div class='text-sm text-sky-600 font-bold col-span-3'>
                + {f($gains['masteryXP'], 2)} mastery XP
            </div>
            {#if $gains['skillLU']}
            <div class='text-sm text-fuchsia-500 font-bold col-span-3'>
                Your {cap($actionType)} level has increased to ({$skillXP['level']})
            </div>
            {/if}
            {#if $gains['masteryLU']}
            <div class='text-sm text-sky-600 font-bold col-span-3'>
                Your mastery level has increased to ({$masteryXP['level']})!
            </div>
            {/if}
            {#if $gains['proficiencyLU']}
            <div class='text-sm text-violet-500 font-bold col-span-3'>
                Your {cap($gains['resource'])} proficiency has increased to ({$gains['nextProficiencyLevel']+1 || 'N/A'})! (+1 die)
            </div>
            {:else}
            <div class='group'>
                <div class='text-sm text-violet-500 underline font-bold col-span-3'>
                   (?) +{f($gains['resGain'] || 0)} {$gains['resource']} proficiency
                    ({fp($gains['totalResProficiency']/$proficiencyValues[$gains['nextProficiencyLevel'] || 1])} to proficiency {$gains['nextProficiencyLevel']+1 || 'N/A'})
                <div class='tooltip'>Proficiency increases the ability to get more and higher-rarity resources.
                    <br/>Proficiency levels are increased per-resource (across all rarities).
                    <br/>Each proficiency level adds 1 die to the skill roll for that resource.
                    <br/>Your {cap($gains['resource'] || '???')} proficiency is 
                    <span class='text-violet-400'>
                        {f($gains['nextProficiencyLevel'])} ({f($gains['totalResProficiency'])} / {f($proficiencyValues[$gains['nextProficiencyLevel'] || 1] || 0)}).
                    </span>
                    <br/>Each action harvesting {cap($gains['resource'] || '???')} rolls 
                    <span class='text-violet-400'>
                        {($gains['roll'] || []).length}
                    </span> {($gains['roll'] || []).length === 1 ? 'die.' : 'dice.'}
                </div>
                </div>
            </div>
            {/if}
        {/if}
    </div>
    {#if $gains && ($gains['bonuses'] || []).length > 0}
    <div class='col-span-2 text-sm'>
        You gained the following bonuses this action: 
        {#each $gains['bonuses'] as b}
        <div class='{$genWalletColors[b['type']]}'>
            <strong>+ {f(b['total'])} {b['type']}</strong> 
                ({f(b['base'])} + {f(b['bonus'])} mastery bonus)
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


