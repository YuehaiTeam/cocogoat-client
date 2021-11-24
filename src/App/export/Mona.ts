import { Artifact } from '@/typings/Artifact'
const getStander = {
    setName: <Record<string, string[]>>{
        磐陀裂生之花: ['archaicPetra', 'flower'],
        嵯峨群峰之翼: ['archaicPetra', 'feather'],
        星罗圭壁之晷: ['archaicPetra', 'sand'],
        星罗圭璧之晷: ['archaicPetra', 'sand'],
        巉岩琢塑之樽: ['archaicPetra', 'cup'],
        不动玄石之相: ['archaicPetra', 'head'],
        历经风雪的思念: ['blizzardStrayer', 'flower'],
        摧冰而行的执望: ['blizzardStrayer', 'feather'],
        冰雪故园的终期: ['blizzardStrayer', 'sand'],
        遍结寒霜的傲骨: ['blizzardStrayer', 'cup'],
        破冰踏雪的回音: ['blizzardStrayer', 'head'],
        染血的铁之心: ['bloodstainedChivalry', 'flower'],
        染血的黑之羽: ['bloodstainedChivalry', 'feather'],
        骑士染血之时: ['bloodstainedChivalry', 'sand'],
        染血骑士之杯: ['bloodstainedChivalry', 'cup'],
        染血的铁假面: ['bloodstainedChivalry', 'head'],
        魔女的炎之花: ['crimsonWitch', 'flower'],
        魔女常燃之羽: ['crimsonWitch', 'feather'],
        魔女破灭之时: ['crimsonWitch', 'sand'],
        魔女的心之火: ['crimsonWitch', 'cup'],
        焦灼的魔女帽: ['crimsonWitch', 'head'],
        角斗士的留恋: ['gladiatorFinale', 'flower'],
        角斗士的归宿: ['gladiatorFinale', 'feather'],
        角斗士的希冀: ['gladiatorFinale', 'sand'],
        角斗士的酣醉: ['gladiatorFinale', 'cup'],
        角斗士的凯旋: ['gladiatorFinale', 'head'],
        饰金胸花: ['heartOfDepth', 'flower'],
        追忆之风: ['heartOfDepth', 'feather'],
        坚铜罗盘: ['heartOfDepth', 'sand'],
        沉波之盏: ['heartOfDepth', 'cup'],
        酒渍船帽: ['heartOfDepth', 'head'],
        渡火者的决绝: ['lavaWalker', 'flower'],
        渡火者的解脱: ['lavaWalker', 'feather'],
        渡火者的煎熬: ['lavaWalker', 'sand'],
        渡火者的醒悟: ['lavaWalker', 'cup'],
        渡火者的智慧: ['lavaWalker', 'head'],
        远方的少女之心: ['maidenBeloved', 'flower'],
        少女飘摇的思念: ['maidenBeloved', 'feather'],
        少女苦短的良辰: ['maidenBeloved', 'sand'],
        少女片刻的闲暇: ['maidenBeloved', 'cup'],
        少女易逝的芳颜: ['maidenBeloved', 'head'],
        宗室之花: ['noblesseOblige', 'flower'],
        宗室之翎: ['noblesseOblige', 'feather'],
        宗室时计: ['noblesseOblige', 'sand'],
        宗室银瓮: ['noblesseOblige', 'cup'],
        宗室面具: ['noblesseOblige', 'head'],
        夏祭之花: ['retracingBolide', 'flower'],
        夏祭终末: ['retracingBolide', 'feather'],
        夏祭之刻: ['retracingBolide', 'sand'],
        夏祭水玉: ['retracingBolide', 'cup'],
        夏祭之面: ['retracingBolide', 'head'],
        平雷之心: ['thunderSmoother', 'flower'],
        平雷之羽: ['thunderSmoother', 'feather'],
        平雷之刻: ['thunderSmoother', 'sand'],
        平雷之器: ['thunderSmoother', 'cup'],
        平雷之冠: ['thunderSmoother', 'head'],
        雷鸟的怜悯: ['thunderingFury', 'flower'],
        雷灾的孑遗: ['thunderingFury', 'feather'],
        雷霆的时计: ['thunderingFury', 'sand'],
        降雷的凶兆: ['thunderingFury', 'cup'],
        唤雷的头冠: ['thunderingFury', 'head'],
        野花记忆的绿野: ['viridescentVenerer', 'flower'],
        猎人青翠的箭羽: ['viridescentVenerer', 'feather'],
        翠绿猎人的笃定: ['viridescentVenerer', 'sand'],
        翠绿猎人的容器: ['viridescentVenerer', 'cup'],
        翠绿的猎人之冠: ['viridescentVenerer', 'head'],
        乐团的晨光: ['wandererTroupe', 'flower'],
        琴师的箭羽: ['wandererTroupe', 'feather'],
        终幕的时计: ['wandererTroupe', 'sand'],
        终末的时计: ['wandererTroupe', 'sand'],
        吟游者之壶: ['wandererTroupe', 'cup'],
        指挥的礼帽: ['wandererTroupe', 'head'],
        战狂的蔷薇: ['berserker', 'flower'],
        战狂的翎羽: ['berserker', 'feather'],
        战狂的时计: ['berserker', 'sand'],
        战狂的骨杯: ['berserker', 'cup'],
        战狂的鬼面: ['berserker', 'head'],
        勇士的勋章: ['braveHeart', 'flower'],
        勇士的期许: ['braveHeart', 'feather'],
        勇士的坚毅: ['braveHeart', 'sand'],
        勇士的壮行: ['braveHeart', 'cup'],
        勇士的冠冕: ['braveHeart', 'head'],
        守护之花: ['defenderWill', 'flower'],
        守护徽印: ['defenderWill', 'feather'],
        守护座钟: ['defenderWill', 'sand'],
        守护之皿: ['defenderWill', 'cup'],
        守护束带: ['defenderWill', 'head'],
        流放者之花: ['exile', 'flower'],
        流放者之羽: ['exile', 'feather'],
        流放者怀表: ['exile', 'sand'],
        流放者之杯: ['exile', 'cup'],
        流放者头冠: ['exile', 'head'],
        赌徒的胸花: ['gambler', 'flower'],
        赌徒的羽饰: ['gambler', 'feather'],
        赌徒的怀表: ['gambler', 'sand'],
        赌徒的骰盅: ['gambler', 'cup'],
        赌徒的耳环: ['gambler', 'head'],
        教官的胸花: ['instructor', 'flower'],
        教官的羽饰: ['instructor', 'feather'],
        教官的怀表: ['instructor', 'sand'],
        教官的茶杯: ['instructor', 'cup'],
        教官的帽子: ['instructor', 'head'],
        武人的红花: ['martialArtist', 'flower'],
        武人的羽饰: ['martialArtist', 'feather'],
        武人的水漏: ['martialArtist', 'sand'],
        武人的酒杯: ['martialArtist', 'cup'],
        武人的头巾: ['martialArtist', 'head'],
        祭水礼冠: ['prayersForDestiny', 'head'],
        祭火礼冠: ['prayersForIllumination', 'head'],
        祭雷礼冠: ['prayersForWisdom', 'head'],
        祭冰礼冠: ['prayersToSpringtime', 'head'],
        故人之心: ['resolutionOfSojourner', 'flower'],
        归乡之羽: ['resolutionOfSojourner', 'feather'],
        逐光之石: ['resolutionOfSojourner', 'sand'],
        异国之盏: ['resolutionOfSojourner', 'cup'],
        感别之冠: ['resolutionOfSojourner', 'head'],
        学士的书签: ['scholar', 'flower'],
        学士的羽笔: ['scholar', 'feather'],
        学士的时钟: ['scholar', 'sand'],
        学士的墨杯: ['scholar', 'cup'],
        学士的镜片: ['scholar', 'head'],
        奇迹之花: ['tinyMiracle', 'flower'],
        奇迹之羽: ['tinyMiracle', 'feather'],
        奇迹之沙: ['tinyMiracle', 'sand'],
        奇迹之杯: ['tinyMiracle', 'cup'],
        奇迹耳坠: ['tinyMiracle', 'head'],
        冒险家之花: ['adventurer', 'flower'],
        冒险家尾羽: ['adventurer', 'feather'],
        冒险家怀表: ['adventurer', 'sand'],
        冒险家金杯: ['adventurer', 'cup'],
        冒险家头带: ['adventurer', 'head'],
        幸运儿绿花: ['luckyDog', 'flower'],
        幸运儿鹰羽: ['luckyDog', 'feather'],
        幸运儿沙漏: ['luckyDog', 'sand'],
        幸运儿之杯: ['luckyDog', 'cup'],
        幸运儿银冠: ['luckyDog', 'head'],
        游医的银莲: ['travelingDoctor', 'flower'],
        游医的枭羽: ['travelingDoctor', 'feather'],
        游医的怀钟: ['travelingDoctor', 'sand'],
        游医的药壶: ['travelingDoctor', 'cup'],
        游医的方巾: ['travelingDoctor', 'head'],
        勋绩之花: ['tenacityOfTheMillelith', 'flower'],
        昭武翎羽: ['tenacityOfTheMillelith', 'feather'],
        金铜时晷: ['tenacityOfTheMillelith', 'sand'],
        盟誓金爵: ['tenacityOfTheMillelith', 'cup'],
        将帅兜鍪: ['tenacityOfTheMillelith', 'head'],
        无垢之花: ['paleFlame', 'flower'],
        贤医之羽: ['paleFlame', 'feather'],
        停摆之刻: ['paleFlame', 'sand'],
        超越之盏: ['paleFlame', 'cup'],
        嗤笑之面: ['paleFlame', 'head'],
        明威之镡: ['emblemOfSeveredFate', 'flower'],
        切落之羽: ['emblemOfSeveredFate', 'feather'],
        雷云之笼: ['emblemOfSeveredFate', 'sand'],
        绯花之壶: ['emblemOfSeveredFate', 'cup'],
        华饰之兜: ['emblemOfSeveredFate', 'head'],
        羁缠之花: ['shimenawaReminiscence', 'flower'],
        思忆之矢: ['shimenawaReminiscence', 'feather'],
        朝露之时: ['shimenawaReminiscence', 'sand'],
        祈望之心: ['shimenawaReminiscence', 'cup'],
        无常之面: ['shimenawaReminiscence', 'head'],
        荣花之期: ['huskOfOpulentDreams', 'flower'],
        华馆之羽: ['huskOfOpulentDreams', 'feather'],
        众生之谣: ['huskOfOpulentDreams', 'sand'],
        梦醒之瓢: ['huskOfOpulentDreams', 'cup'],
        形骸之笠: ['huskOfOpulentDreams', 'head'],
        海染之花: ['oceanHuedClam', 'flower'],
        渊宫之羽: ['oceanHuedClam', 'feather'],
        离别之贝: ['oceanHuedClam', 'sand'],
        真珠之笼: ['oceanHuedClam', 'cup'],
        海祇之冠: ['oceanHuedClam', 'head'],
    },
    tag: <Record<string, string>>{
        暴击率: 'critical',
        暴击伤害: 'criticalDamage',
        固定攻击力: 'attackStatic',
        攻击力: 'attackPercentage',
        元素精通: 'elementalMastery',
        元素充能效率: 'recharge',
        固定生命值: 'lifeStatic',
        生命值: 'lifePercentage',
        固定防御力: 'defendStatic',
        防御力: 'defendPercentage',
        物理伤害加成: 'physicalBonus',
        治疗加成: 'cureEffect',
        岩元素伤害加成: 'rockBonus',
        风元素伤害加成: 'windBonus',
        冰元素伤害加成: 'iceBonus',
        水元素伤害加成: 'waterBonus',
        火元素伤害加成: 'fireBonus',
        雷元素伤害加成: 'thunderBonus',
    },
}
export type MonaArtifactTypeName = 'flower' | 'feather' | 'sand' | 'cup' | 'head'
interface MonaArtifact {
    id: number // ID
    setName: string // 套装名
    detailName: string // 中文名
    position: MonaArtifactTypeName // 位置, slot
    mainTag: any // 主词条, main stat
    normalTags: any[] // 副词条, sub stat
    omit: boolean // 是否禁用该圣遗物, disabled or not
    level: number // 等级，整数, integer
    star: number // 星级，整数, integer
}
interface MonaInterface {
    version?: string
    cocogoat?: string
    flower: MonaArtifact[]
    feather: MonaArtifact[]
    sand: MonaArtifact[]
    cup: MonaArtifact[]
    head: MonaArtifact[]
}

export function convertAsMona(artifacts: Artifact[]) {
    const json = {
        version: '1',
        cocogoat: '1',
        flower: [],
        feather: [],
        sand: [],
        cup: [],
        head: [],
    } as MonaInterface
    for (let i = 0; i < artifacts.length; i++) {
        const sub = []
        for (let j = 0; j < artifacts[i].sub.length; j++) {
            sub.push({
                name:
                    artifacts[i].sub[j].value.includes('%') ||
                    (!artifacts[i].sub[j].name.includes('生命值') &&
                        !artifacts[i].sub[j].name.includes('防御力') &&
                        !artifacts[i].sub[j].name.includes('攻击力'))
                        ? getStander.tag[artifacts[i].sub[j].name]
                        : getStander.tag['固定' + artifacts[i].sub[j].name],
                value: artifacts[i].sub[j].value.includes('%')
                    ? parseFloat(artifacts[i].sub[j].value.replace('%', '')) * 0.01
                    : Number(artifacts[i].sub[j].value),
            })
        }
        try {
            const tmp = <MonaArtifact>{
                setName: getStander.setName[artifacts[i].name][0],
                detailName: artifacts[i].name,
                position: getStander.setName[artifacts[i].name][1],
                mainTag: {
                    name:
                        artifacts[i].main.value.includes('%') ||
                        (!artifacts[i].main.name.includes('生命值') &&
                            !artifacts[i].main.name.includes('防御力') &&
                            !artifacts[i].main.name.includes('攻击力'))
                            ? getStander.tag[artifacts[i].main.name]
                            : getStander.tag['固定' + artifacts[i].main.name],
                    value: artifacts[i].main.value.includes('%')
                        ? parseFloat(artifacts[i].main.value.replace('%', '')) * 0.01
                        : Number(artifacts[i].main.value),
                },
                normalTags: sub,
                omit: false,
                level: artifacts[i].level,
                star: artifacts[i].stars,
                id: artifacts[i].id,
            }
            json[tmp.position].push(tmp)
        } catch (e) {
            console.log(e)
        }
    }
    return json
}
