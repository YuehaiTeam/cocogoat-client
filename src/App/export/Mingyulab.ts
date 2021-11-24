import { Artifact } from '@/typings/Artifact'
const getStander = {
    setName: <Record<string, string[]>>{
        磐陀裂生之花: ['archaic_petra', 'flower'],
        嵯峨群峰之翼: ['archaic_petra', 'plume'],
        星罗圭壁之晷: ['archaic_petra', 'eon'],
        星罗圭璧之晷: ['archaic_petra', 'eon'],
        巉岩琢塑之樽: ['archaic_petra', 'goblet'],
        不动玄石之相: ['archaic_petra', 'circlet'],
        历经风雪的思念: ['blizzard_walker', 'flower'],
        摧冰而行的执望: ['blizzard_walker', 'plume'],
        冰雪故园的终期: ['blizzard_walker', 'eon'],
        遍结寒霜的傲骨: ['blizzard_walker', 'goblet'],
        破冰踏雪的回音: ['blizzard_walker', 'circlet'],
        染血的铁之心: ['bloodstained_chivalry', 'flower'],
        染血的黑之羽: ['bloodstained_chivalry', 'plume'],
        骑士染血之时: ['bloodstained_chivalry', 'eon'],
        染血骑士之杯: ['bloodstained_chivalry', 'goblet'],
        染血的铁假面: ['bloodstained_chivalry', 'circlet'],
        魔女的炎之花: ['crimson_witch_of_flames', 'flower'],
        魔女常燃之羽: ['crimson_witch_of_flames', 'plume'],
        魔女破灭之时: ['crimson_witch_of_flames', 'eon'],
        魔女的心之火: ['crimson_witch_of_flames', 'goblet'],
        焦灼的魔女帽: ['crimson_witch_of_flames', 'circlet'],
        角斗士的留恋: ['gladiators_finale', 'flower'],
        角斗士的归宿: ['gladiators_finale', 'plume'],
        角斗士的希冀: ['gladiators_finale', 'eon'],
        角斗士的酣醉: ['gladiators_finale', 'goblet'],
        角斗士的凯旋: ['gladiators_finale', 'circlet'],
        饰金胸花: ['heart_of_depth', 'flower'],
        追忆之风: ['heart_of_depth', 'plume'],
        坚铜罗盘: ['heart_of_depth', 'eon'],
        沉波之盏: ['heart_of_depth', 'goblet'],
        酒渍船帽: ['heart_of_depth', 'circlet'],
        渡火者的决绝: ['lavawalker', 'flower'],
        渡火者的解脱: ['lavawalker', 'plume'],
        渡火者的煎熬: ['lavawalker', 'eon'],
        渡火者的醒悟: ['lavawalker', 'goblet'],
        渡火者的智慧: ['lavawalker', 'circlet'],
        远方的少女之心: ['maiden_beloved', 'flower'],
        少女飘摇的思念: ['maiden_beloved', 'plume'],
        少女苦短的良辰: ['maiden_beloved', 'eon'],
        少女片刻的闲暇: ['maiden_beloved', 'goblet'],
        少女易逝的芳颜: ['maiden_beloved', 'circlet'],
        宗室之花: ['noblesse_oblige', 'flower'],
        宗室之翎: ['noblesse_oblige', 'plume'],
        宗室时计: ['noblesse_oblige', 'eon'],
        宗室银瓮: ['noblesse_oblige', 'goblet'],
        宗室面具: ['noblesse_oblige', 'circlet'],
        夏祭之花: ['retracing_bolide', 'flower'],
        夏祭终末: ['retracing_bolide', 'plume'],
        夏祭之刻: ['retracing_bolide', 'eon'],
        夏祭水玉: ['retracing_bolide', 'goblet'],
        夏祭之面: ['retracing_bolide', 'circlet'],
        平雷之心: ['thundersoother', 'flower'],
        平雷之羽: ['thundersoother', 'plume'],
        平雷之刻: ['thundersoother', 'eon'],
        平雷之器: ['thundersoother', 'goblet'],
        平雷之冠: ['thundersoother', 'circlet'],
        雷鸟的怜悯: ['thundering_fury', 'flower'],
        雷灾的孑遗: ['thundering_fury', 'plume'],
        雷霆的时计: ['thundering_fury', 'eon'],
        降雷的凶兆: ['thundering_fury', 'goblet'],
        唤雷的头冠: ['thundering_fury', 'circlet'],
        野花记忆的绿野: ['viridescent_venerer', 'flower'],
        猎人青翠的箭羽: ['viridescent_venerer', 'plume'],
        翠绿猎人的笃定: ['viridescent_venerer', 'eon'],
        翠绿猎人的容器: ['viridescent_venerer', 'goblet'],
        翠绿的猎人之冠: ['viridescent_venerer', 'circlet'],
        乐团的晨光: ['wanderers_troupe', 'flower'],
        琴师的箭羽: ['wanderers_troupe', 'plume'],
        终幕的时计: ['wanderers_troupe', 'eon'],
        终末的时计: ['wanderers_troupe', 'eon'],
        吟游者之壶: ['wanderers_troupe', 'goblet'],
        指挥的礼帽: ['wanderers_troupe', 'circlet'],
        战狂的蔷薇: ['berserker', 'flower'],
        战狂的翎羽: ['berserker', 'plume'],
        战狂的时计: ['berserker', 'eon'],
        战狂的骨杯: ['berserker', 'goblet'],
        战狂的鬼面: ['berserker', 'circlet'],
        勇士的勋章: ['brave_heart', 'flower'],
        勇士的期许: ['brave_heart', 'plume'],
        勇士的坚毅: ['brave_heart', 'eon'],
        勇士的壮行: ['brave_heart', 'goblet'],
        勇士的冠冕: ['brave_heart', 'circlet'],
        守护之花: ['defenders_will', 'flower'],
        守护徽印: ['defenders_will', 'plume'],
        守护座钟: ['defenders_will', 'eon'],
        守护之皿: ['defenders_will', 'goblet'],
        守护束带: ['defenders_will', 'circlet'],
        流放者之花: ['the_exile', 'flower'],
        流放者之羽: ['the_exile', 'plume'],
        流放者怀表: ['the_exile', 'eon'],
        流放者之杯: ['the_exile', 'goblet'],
        流放者头冠: ['the_exile', 'circlet'],
        赌徒的胸花: ['gambler', 'flower'],
        赌徒的羽饰: ['gambler', 'plume'],
        赌徒的怀表: ['gambler', 'eon'],
        赌徒的骰盅: ['gambler', 'goblet'],
        赌徒的耳环: ['gambler', 'circlet'],
        教官的胸花: ['instructor', 'flower'],
        教官的羽饰: ['instructor', 'plume'],
        教官的怀表: ['instructor', 'eon'],
        教官的茶杯: ['instructor', 'goblet'],
        教官的帽子: ['instructor', 'circlet'],
        武人的红花: ['martial_artist', 'flower'],
        武人的羽饰: ['martial_artist', 'plume'],
        武人的水漏: ['martial_artist', 'eon'],
        武人的酒杯: ['martial_artist', 'goblet'],
        武人的头巾: ['martial_artist', 'circlet'],
        祭水礼冠: ['prayers_for_destiny', 'circlet'],
        祭火礼冠: ['prayers_for_illumination', 'circlet'],
        祭雷礼冠: ['prayers_for_wisdom', 'circlet'],
        祭冰礼冠: ['prayers_to_springtime', 'circlet'],
        故人之心: ['resolution_of_sojourner', 'flower'],
        归乡之羽: ['resolution_of_sojourner', 'plume'],
        逐光之石: ['resolution_of_sojourner', 'eon'],
        异国之盏: ['resolution_of_sojourner', 'goblet'],
        感别之冠: ['resolution_of_sojourner', 'circlet'],
        学士的书签: ['scholar', 'flower'],
        学士的羽笔: ['scholar', 'plume'],
        学士的时钟: ['scholar', 'eon'],
        学士的墨杯: ['scholar', 'goblet'],
        学士的镜片: ['scholar', 'circlet'],
        奇迹之花: ['tiny_miracle', 'flower'],
        奇迹之羽: ['tiny_miracle', 'plume'],
        奇迹之沙: ['tiny_miracle', 'eon'],
        奇迹之杯: ['tiny_miracle', 'goblet'],
        奇迹耳坠: ['tiny_miracle', 'circlet'],
        冒险家之花: ['adventurer', 'flower'],
        冒险家尾羽: ['adventurer', 'plume'],
        冒险家怀表: ['adventurer', 'eon'],
        冒险家金杯: ['adventurer', 'goblet'],
        冒险家头带: ['adventurer', 'circlet'],
        幸运儿绿花: ['lucky_dog', 'flower'],
        幸运儿鹰羽: ['lucky_dog', 'plume'],
        幸运儿沙漏: ['lucky_dog', 'eon'],
        幸运儿之杯: ['lucky_dog', 'goblet'],
        幸运儿银冠: ['lucky_dog', 'circlet'],
        游医的银莲: ['traveling_doctor', 'flower'],
        游医的枭羽: ['traveling_doctor', 'plume'],
        游医的怀钟: ['traveling_doctor', 'eon'],
        游医的药壶: ['traveling_doctor', 'goblet'],
        游医的方巾: ['traveling_doctor', 'circlet'],
        勋绩之花: ['tenacity_of_the_millelith', 'flower'],
        昭武翎羽: ['tenacity_of_the_millelith', 'plume'],
        金铜时晷: ['tenacity_of_the_millelith', 'eon'],
        盟誓金爵: ['tenacity_of_the_millelith', 'goblet'],
        将帅兜鍪: ['tenacity_of_the_millelith', 'circlet'],
        无垢之花: ['pale_flame', 'flower'],
        贤医之羽: ['pale_flame', 'plume'],
        停摆之刻: ['pale_flame', 'eon'],
        超越之盏: ['pale_flame', 'goblet'],
        嗤笑之面: ['pale_flame', 'circlet'],
        明威之镡: ['seal_of_insulation', 'flower'],
        切落之羽: ['seal_of_insulation', 'plume'],
        雷云之笼: ['seal_of_insulation', 'eon'],
        绯花之壶: ['seal_of_insulation', 'goblet'],
        华饰之兜: ['seal_of_insulation', 'circlet'],
        羁缠之花: ['reminiscence_of_shime', 'flower'],
        思忆之矢: ['reminiscence_of_shime', 'plume'],
        朝露之时: ['reminiscence_of_shime', 'eon'],
        祈望之心: ['reminiscence_of_shime', 'goblet'],
        无常之面: ['reminiscence_of_shime', 'circlet'],
        荣花之期: ['husk_of_opulent_dreams', 'flower'],
        华馆之羽: ['husk_of_opulent_dreams', 'plume'],
        众生之谣: ['husk_of_opulent_dreams', 'eon'],
        梦醒之瓢: ['husk_of_opulent_dreams', 'globlet'],
        形骸之笠: ['husk_of_opulent_dreams', 'circlet'],
        海染之花: ['divine_chorus', 'flower'],
        渊宫之羽: ['divine_chorus', 'plume'],
        离别之贝: ['divine_chorus', 'eon'],
        真珠之笼: ['divine_chorus', 'globlet'],
        海祇之冠: ['divine_chorus', 'circlet'],
    },
    tag: <Record<string, string>>{
        暴击率: 'critRate',
        暴击伤害: 'critDamage',
        固定攻击力: 'flatATK',
        攻击力: 'percentATK',
        元素精通: 'elementalMastery',
        元素充能效率: 'energyRecharge',
        固定生命值: 'flatHP',
        生命值: 'percentHP',
        固定防御力: 'flatDEF',
        防御力: 'percentDEF',
        物理伤害加成: 'physicalDamage',
        治疗加成: 'healing',
        岩元素伤害加成: 'geoDamage',
        风元素伤害加成: 'anemoDamage',
        冰元素伤害加成: 'cryoDamage',
        水元素伤害加成: 'hydroDamage',
        火元素伤害加成: 'pyroDamage',
        雷元素伤害加成: 'electroDamage',
    },
}
interface MingyulabArtifact {
    asKey: string // 套装
    rarity: number // 星
    slot: string // 位置
    level: number // 等级
    mainStat: string // 主词条
    subStat1Type?: string
    subStat1Value?: string
    subStat2Type?: string
    subStat2Value?: string
    subStat3Type?: string
    subStat3Value?: string
    subStat4Type?: string
    subStat5Value?: string
    mark: string // 'none'
}
export function convertAsMingyulab(artifacts: Artifact[]) {
    const data: MingyulabArtifact[] = []
    for (let i = 0; i < artifacts.length; i++) {
        try {
            const p = {
                asKey: getStander.setName[artifacts[i].name][0],
                slot: getStander.setName[artifacts[i].name][1],
                mainStat:
                    artifacts[i].main.value.includes('%') ||
                    (!artifacts[i].main.name.includes('生命值') &&
                        !artifacts[i].main.name.includes('防御力') &&
                        !artifacts[i].main.name.includes('攻击力'))
                        ? getStander.tag[artifacts[i].main.name]
                        : getStander.tag['固定' + artifacts[i].main.name],
                level: artifacts[i].level,
                rarity: artifacts[i].stars,
                mark: 'none',
            }
            for (let j = 0; j < artifacts[i].sub.length; j++) {
                const name =
                    artifacts[i].sub[j].value.includes('%') ||
                    (!artifacts[i].sub[j].name.includes('生命值') &&
                        !artifacts[i].sub[j].name.includes('防御力') &&
                        !artifacts[i].sub[j].name.includes('攻击力'))
                        ? getStander.tag[artifacts[i].sub[j].name]
                        : getStander.tag['固定' + artifacts[i].sub[j].name]
                const value = artifacts[i].sub[j].value.includes('%')
                    ? parseFloat(artifacts[i].sub[j].value.replace('%', ''))
                    : Number(artifacts[i].sub[j].value)
                // @ts-ignore
                p[`subStat${j + 1}Type`] = name.toString()
                // @ts-ignore
                p[`subStat${j + 1}Value`] = value.toString()
            }
            data.push(p)
        } catch (e) {
            console.log(e)
        }
    }
    return data
}
