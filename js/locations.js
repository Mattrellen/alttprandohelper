(function(window) {
    'use strict';

    var query = uri_query(),
        is_standard = query.mode === 'standard';

    function always() { return 'available'; }

    window.dungeons = {
        eastern: {
            caption: 'Eastern Palace {lantern}',
            prize: 0,
            completed: false,
            is_completable: function() {
                return items.has_bow() ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            },
            chests: 3,
            chest_limit: 3,
            is_progressable: function() {
                return this.chests <= 2 && !items.lantern ||
                    this.chests === 1 && !items.has_bow() ?
                    'possible' : 'available';
            }
        },
        desert: {
            caption: 'Desert Palace',
            prize: 0,
            completed: false,
            is_completable: function() {
                if (!(items.has_melee_bow() || items.has_cane() || items.has_rod())) return 'unavailable';
                if (!(items.book && items.glove) && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
                if (!items.lantern && !items.firerod) return 'unavailable';
                return items.boots ? 'available' : 'possible';
            },
            chests: 2,
            chest_limit: 2,
            is_progressable: function() {
                if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
                if (items.glove && (items.firerod || items.lantern) && items.boots) return 'available';
                return this.chests > 1 && items.boots ? 'available' : 'possible';
            }
        },
        hera: {
            caption: 'Tower of Hera',
            prize: 0,
            completed: false,
            is_completable: function() {
                if (!items.has_melee()) return 'unavailable';
                return this.is_progressable();
            },
            chests: 2,
            chest_limit: 2,
            is_progressable: function() {
                if (!items.flute && !items.glove) return 'unavailable';
                if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
                return items.firerod || items.lantern ?
                    items.flute || items.lantern ? 'available' : 'dark' :
                    'possible';
            }
        },
        darkness: {
            caption: 'Palace of Darkness {lantern}',
            prize: 0,
            completed: false,
            is_completable: function() {
                if (!items.moonpearl || !items.has_bow() || !items.hammer) return 'unavailable';
                if (!items.agahnim && !items.glove) return 'unavailable';
                return items.lantern ? 'available' : 'dark';
            },
            chests: 5,
            chest_limit: 5,
            is_progressable: function() {
                if (!items.moonpearl) return 'unavailable';
                if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
                return !(items.has_bow() && items.lantern) ||
                    this.chests === 1 && !items.hammer ?
                    'possible' : 'available';
            }
        },
        swamp: {
            caption: 'Swamp Palace {mirror}',
            prize: 0,
            completed: false,
            is_completable: function() {
                if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
                if (!items.hammer || !items.hookshot) return 'unavailable';
                if (!items.glove && !items.agahnim) return 'unavailable';
                return 'available';
            },
            chests: 6,
            chest_limit: 6,
            is_progressable: function() {
                if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
                if (!items.can_reach_outcast() && !(items.agahnim && items.hammer)) return 'unavailable';

                if (this.chests <= 2) return !items.hammer || !items.hookshot ? 'unavailable' : 'available';
                if (this.chests <= 4) return !items.hammer ? 'unavailable' : !items.hookshot ? 'possible' : 'available';
                if (this.chests <= 5) return !items.hammer ? 'unavailable' : 'available';
                return !items.hammer ? 'possible' : 'available';
            }
        },
        skull: {
            caption: 'Skull Woods',
            prize: 0,
            completed: false,
            is_completable: function() {
                return !items.can_reach_outcast() || !items.firerod || !items.sword ? 'unavailable' : 'available';
            },
            chests: 2,
            chest_limit: 2,
            is_progressable: function() {
                if (!items.can_reach_outcast()) return 'unavailable';
                return items.firerod ? 'available' : 'possible';
            }
        },
        thieves: {
            caption: 'Thieves\' Town',
            prize: 0,
            completed: false,
            is_completable: function() {
                if (!(items.has_melee() || items.has_cane())) return 'unavailable';
                if (!items.can_reach_outcast()) return 'unavailable';
                return 'available';
            },
            chests: 4,
            chest_limit: 4,
            is_progressable: function() {
                if (!items.can_reach_outcast()) return 'unavailable';
                return this.chests === 1 && !items.hammer ? 'possible' : 'available';
            }
        },
        ice: {
            caption: 'Ice Palace (yellow=must bomb jump)',
            prize: 0,
            completed: false,
            is_completable: function() {
                if (!items.moonpearl || !items.flippers || items.glove !== 2 || !items.hammer) return 'unavailable';
                if (!items.firerod && !(items.bombos && items.sword)) return 'unavailable';
                return items.hookshot || items.somaria ? 'available' : 'possible';
            },
            chests: 3,
            chest_limit: 3,
            is_progressable: function() {
                if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
                if (!items.firerod && !(items.bombos && items.sword)) return 'unavailable';
                return items.hammer ? 'available' : 'possible';
            }
        },
        mire: {
            caption: 'Misery Mire {medallion0}{lantern}',
            prize: 0,
            medallion: 0,
            completed: false,
            is_completable: function() {
                if (!items.has_melee_bow()) return 'unavailable';
                if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.boots && !items.hookshot) return 'unavailable';
                var state = items.medallion_check(dungeons['mire'].medallion);
                if (state) return state;

                return items.lantern || items.firerod ?
                    items.lantern ? 'available' : 'dark' :
                    'possible';
            },
            chests: 2,
            chest_limit: 2,
            is_progressable: function() {
                if (!items.moonpearl || !items.flute || items.glove !== 2) return 'unavailable';
                if (!items.boots && !items.hookshot) return 'unavailable';
                var state = items.medallion_check(dungeons['mire'].medallion);
                if (state) return state;

                return (this.chests > 1 ?
                    items.lantern || items.firerod :
                    items.lantern && items.somaria) ?
                    'available' : 'possible';
            }
        },
        turtle: {
            caption: 'Turtle Rock {medallion0}{lantern}',
            prize: 0,
            medallion: 0,
            completed: false,
            is_completable: function() {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.hookshot && !items.mirror) return 'unavailable';
                if (!items.icerod || !items.firerod) return 'unavailable';
                var state = items.medallion_check(dungeons['turtle'].medallion);
                if (state) return state;

                return items.byrna || items.cape || items.shield === 3 ?
                    items.lantern ? 'available' : 'dark' :
                    'possible';
            },
            chests: 5,
            chest_limit: 5,
            is_progressable: function() {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
                if (!items.hookshot && !items.mirror) return 'unavailable';
                var state = items.medallion_check(dungeons['turtle'].medallion);
                if (state) return state;

                var laser_safety = items.byrna || items.cape || items.shield === 3,
                    dark_room = items.lantern ? 'available' : 'dark';
                if (this.chests <= 1) return !laser_safety ? 'unavailable' : items.firerod && items.icerod ? dark_room : 'possible';
                if (this.chests <= 2) return !laser_safety ? 'unavailable' : items.firerod ? dark_room : 'possible';
                if (this.chests <= 4) return laser_safety && items.firerod && items.lantern ? 'available' : 'possible';
                return items.firerod && items.lantern ? 'available' : 'possible';
            }
        }
    };

    window.encounters = {
        agahnim: {
            caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
            is_completable: function() {
                return items.sword >= 2 || items.cape && items.sword ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            }
        }
    };

    window.chests = {
        altar: {
            caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
            marked: false,
            is_available: function() {
                var pendant_count = Object.keys(dungeons).reduce(function(s, name) {
                    return [1,2].includes(dungeons[name].prize) && dungeons[name].completed ? s + 1 : s;
                }, 0);

                return pendant_count >= 3 ? 'available' :
                    items.book ? 'possible' : 'unavailable';
            }
        },
        mushroom: {
            caption: 'Mushroom',
            marked: false,
            is_available: always
        },
        hideout: {
            caption: 'Forest Hideout',
            marked: false,
            is_available: always
        },
        tree: {
            caption: 'Lumberjack Tree {agahnim}{boots}',
            marked: false,
            is_available: function() {
                return items.agahnim && items.boots ? 'available' : 'possible';
            }
        },
        lost_man: {
            caption: 'Lost Old Man {lantern}',
            marked: false,
            is_available: function() {
                return items.glove || items.flute ?
                    items.lantern ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        spectacle_cave: {
            caption: 'Spectacle Rock Cave',
            marked: false,
            is_available: function() {
                return items.glove || items.flute ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        spectacle_rock: {
            caption: 'Spectacle Rock {mirror}',
            marked: false,
            is_available: function() {
                return items.glove || items.flute ?
                    items.mirror ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        ether: {
            caption: 'Ether Tablet {sword2}{book}',
            marked: false,
            is_available: function() {
                return items.book && (items.glove || items.flute) && (items.mirror || items.hookshot && items.hammer) ?
                    items.sword >= 2 ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        paradox: {
            caption: 'Death Mountain East (5 + 2 {bomb})',
            marked: false,
            is_available: function() {
                return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        spiral: {
            caption: 'Spiral Cave',
            marked: false,
            is_available: function() {
                return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        island_dm: {
            caption: 'Floating Island {mirror}',
            marked: false,
            is_available: function() {
                return (items.glove || items.flute) && (items.hookshot || items.hammer && items.mirror) ?
                    items.mirror && items.moonpearl && items.glove === 2 ?
                        items.lantern || items.flute ? 'available' : 'dark' :
                        'possible' :
                    'unavailable';
            }
        },
        mimic: {
            caption: 'Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion0} unkown OR possible w/out {firerod})',
            marked: false,
            is_available: function() {
                if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !items.mirror) return 'unavailable';
                var state = items.medallion_check(dungeons['turtle'].medallion);
                if (state) return state;

                return items.firerod ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible';
            }
        },
        graveyard_w: {
            caption: 'West of Sanctuary {boots}',
            marked: false,
            is_available: function() {
                return items.boots ? 'available' : 'unavailable';
            }
        },
        graveyard_n: {
            caption: 'Graveyard Cliff Cave {mirror}',
            marked: false,
            is_available: function() {
                return items.can_reach_outcast() && items.mirror ? 'available' : 'unavailable';
            }
        },
        graveyard_e: {
            caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
            marked: false,
            is_available: function() {
                if (!items.boots) return 'unavailable';
                if (items.can_reach_outcast() && items.mirror || items.glove === 2) return 'available';
                return 'unavailable';
            }
        },
        witch: {
            caption: 'Witch: Give her {mushroom}',
            marked: false,
            is_available: function() {
                return items.mushroom ? 'available' : 'unavailable';
            }
        },
        fairy_lw: {
            caption: 'Waterfall of Wishing (2) {flippers}',
            marked: false,
            is_available: function() {
                return items.flippers ? 'available' : 'unavailable';
            }
        },
        zora: {
            caption: 'King Zora: Pay 500 rupees',
            marked: false,
            is_available: function() {
                return items.flippers || items.glove ? 'available' : 'unavailable';
            }
        },
        river: {
            caption: 'Zora River Ledge {flippers}',
            marked: false,
            is_available: function() {
                if (items.flippers) return 'available';
                if (items.glove) return 'possible';
                return 'unavailable';
            }
        },
        well: {
            caption: 'Kakariko Well (4 + {bomb})',
            marked: false,
            is_available: always
        },
        thief_hut: {
            caption: 'Thieve\'s Hut (4 + {bomb})',
            marked: false,
            is_available: always
        },
        bottle: {
            caption: 'Bottle Vendor: Pay 100 rupees',
            marked: false,
            is_available: always
        },
        chicken: {
            caption: 'Chicken House {bomb}',
            marked: false,
            is_available: always
        },
        kid: {
            caption: 'Dying Boy: Distract him with {bottle} so that you can rob his family!',
            marked: false,
            is_available: function() {
                return items.bottle ? 'available' : 'unavailable';
            }
        },
        tavern: {
            caption: 'Tavern',
            marked: false,
            is_available: always
        },
        bat: {
            caption: 'Mad Batter {hammer}/{mirror} + {powder}',
            marked: false,
            is_available: function() {
                return items.powder && (items.hammer || items.glove === 2 && items.mirror && items.moonpearl) ? 'available' : 'unavailable';
            }
        },
        sahasrahla_hut: {
            caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
            marked: false,
            is_available: always
        },
        sahasrahla: {
            caption: 'Sahasrahla {pendant0}',
            marked: false,
            is_available: function() {
                return Object.keys(dungeons).reduce(function(state, name) {
                    return dungeons[name].prize === 1 && dungeons[name].completed ? 'available' : state;
                }, 'unavailable');
            }
        },
        maze: {
            caption: 'Race Minigame {bomb}/{boots}',
            marked: false,
            is_available: always
        },
        library: {
            caption: 'Library {boots}',
            marked: false,
            is_available: function() {
                return items.boots ? 'available' : 'possible';
            }
        },
        dig_grove: {
            caption: 'Buried Itam {shovel}',
            marked: false,
            is_available: function() {
                return items.shovel ? 'available' : 'unavailable';
            }
        },
        desert_w: {
            caption: 'Desert West Ledge {book}/{mirror}',
            marked: false,
            is_available: function() {
                return items.book || items.flute && items.glove === 2 && items.mirror ? 'available' : 'possible';
            }
        },
        desert_ne: {
            caption: 'Checkerboard Cave {mirror}',
            marked: false,
            is_available: function() {
                return items.flute && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
            }
        },
        aginah: {
            caption: 'Aginah\'s Cave {bomb}',
            marked: false,
            is_available: always
        },
        bombos: {
            caption: 'Bombos Tablet {mirror}{sword2}{book}',
            marked: false,
            is_available: function() {
                return items.book && items.mirror && (items.can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ?
                    items.sword >= 2 ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        grove_s: {
            caption: 'South of Grove {mirror}',
            marked: false,
            is_available: function() {
                return items.mirror && (items.can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
            }
        },
        dam: {
            caption: 'Light World Swamp (2)',
            marked: false,
            is_available: always
        },
        lake_sw: {
            caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
            marked: false,
            is_available: always
        },
        ice_cave: {
            caption: 'Ice Rod Cave {bomb}',
            marked: false,
            is_available: always
        },
        island_lake: {
            caption: 'Lake Hylia Island {mirror}',
            marked: false,
            is_available: function() {
                return items.flippers ?
                    items.moonpearl && items.mirror && (items.agahnim || items.glove === 2 || items.glove && items.hammer) ?
                        'available' : 'possible' :
                    'unavailable';
            }
        },
        hobo: {
            caption: 'Fugitive under the bridge {flippers}',
            marked: false,
            is_available: function() {
                return items.flippers ? 'available' : 'unavailable';
            }
        },
        link_house: {
            caption: 'Stoops Lonk\'s Hoose',
            marked: is_standard,
            is_available: always
        },
        secret: {
            caption: "Castle Secret Entrance (Uncle + 1)",
            marked: is_standard,
            is_available: always
        },
        castle: {
            caption: 'Hyrule Castle Dungeon (3)',
            marked: is_standard,
            is_available: always
        },
        escape_dark: {
            caption: 'Escape Sewer Dark Room {lantern}',
            marked: is_standard,
            is_available: function() {
                return is_standard || items.lantern ? 'available' : 'dark';
            }
        },
        escape_side: {
            caption: 'Escape Sewer Side Room (3) {bomb}/{boots}' + (is_standard ? '' : ' (yellow = need small key)'),
            marked: false,
            is_available: function() {
                return is_standard || items.glove ? 'available' :
                    items.lantern ? 'possible' : 'dark';
            }
        },
        sanctuary: {
            caption: 'Sanctuary',
            marked: is_standard,
            is_available: always
        },
        bumper: {
            caption: 'Bumper Cave {cape}',
            marked: false,
            is_available: function() {
                return items.can_reach_outcast() ?
                    items.glove && items.cape ? 'available' : 'possible' :
                    'unavailable';
            }
        },
        spike: {
            caption: 'Byrna Spike Cave',
            marked: false,
            is_available: function() {
                return items.moonpearl && items.glove && items.hammer && (items.byrna || items.cape) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        bunny: {
            caption: 'Super Bunny Chests (2)',
            marked: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 && (items.hookshot || items.mirror && items.hammer) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        rock_hook: {
            caption: 'Cave Under Rock (3 top chests) {hookshot}',
            marked: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 && items.hookshot ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        rock_boots: {
            caption: 'Cave Under Rock (bottom chest) {hookshot}/{boots}',
            marked: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 && (items.hookshot || (items.mirror && items.hammer && items.boots)) ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'unavailable';
            }
        },
        catfish: {
            caption: 'Catfish',
            marked: false,
            is_available: function() {
                return items.moonpearl && items.glove && (items.agahnim || items.hammer || items.glove === 2 && items.flippers) ?
                    'available' : 'unavailable';
            }
        },
        chest_game: {
            caption: 'Treasure Chest Minigame: Pay 30 rupees',
            marked: false,
            is_available: function() {
                return items.can_reach_outcast() ? 'available' : 'unavailable';
            }
        },
        c_house: {
            caption: 'C House',
            marked: false,
            is_available: function() {
                return items.can_reach_outcast() ? 'available' : 'unavailable';
            }
        },
        bomb_hut: {
            caption: 'Bombable Hut {bomb}',
            marked: false,
            is_available: function() {
                return items.can_reach_outcast() ? 'available' : 'unavailable';
            }
        },
        frog: {
            caption: 'Take the frog home {mirror} / Save+Quit',
            marked: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
            }
        },
        purple: {
            caption: 'Gary\'s Lunchbox (save the frog first)',
            marked: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
            }
        },
        pegs: {
            caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
            marked: false,
            is_available: function() {
                return items.moonpearl && items.glove === 2 && items.hammer ? 'available' : 'unavailable';
            }
        },
        fairy_dw: {
            caption: 'Fat Fairy: Buy OJ bomb from Dark Link\'s House after {crystal}5 {crystal}6 (2 items)',
            marked: false,
            is_available: function() {
                var crystal_count = Object.keys(dungeons).reduce(function(s, name) {
                    return dungeons[name].prize === 4 && dungeons[name].completed ? s + 1 : s;
                }, 0);

                if (crystal_count < 2 || !items.moonpearl) return 'unavailable';
                return items.hammer && (items.agahnim || items.glove) ||
                    items.agahnim && items.mirror && items.can_reach_outcast() ? 'available' : 'unavailable';
            }
        },
        pyramid: {
            caption: 'Pyramid',
            marked: false,
            is_available: function() {
                return items.agahnim || items.glove && items.hammer && items.moonpearl ||
                    items.glove === 2 && items.moonpearl && items.flippers ? 'available' : 'unavailable';
            }
        },
        dig_game: {
            caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
            marked: false,
            is_available: function() {
                return items.can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
            }
        },
        stumpy: {
            caption: 'Ol\' Stumpy',
            marked: false,
            is_available: function() {
                return items.can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
            }
        },
        swamp_ne: {
            caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
            marked: false,
            is_available: function() {
                return items.can_reach_outcast() || (items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
            }
        },
        mire_w: {
            caption: 'West of Mire (2)',
            marked: false,
            is_available: function() {
                return items.moonpearl && items.flute && items.glove === 2 ? 'available' : 'unavailable';
            }
        }
    };
}(window));