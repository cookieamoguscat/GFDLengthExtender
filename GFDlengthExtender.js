//thx staticvariablejames
Game.Win("Cheated cookies taste awful");
Game.Win("Third-party");
if (GFDLengthExtender === undefined) var GFDLengthExtender = {};
if (typeof CCSE == "undefined")
    Game.LoadMod(
        "https://klattmose.github.io/CookieClicker/" +
            (0 ? "Beta/" : "") +
            "CCSE.js",
    );
GFDLengthExtender.name = "GFDLengthExtender";

GFDLengthExtender.begin = () => {
    if (Game.Objects["Wizard tower"].level < 1) {
        Game.Notify(
            "Your tower level is too low for this mod",
            "",
            void 0,
            1,
            true,
        );
        return;
    }

    GFDLengthExtender.GFDLENGTH = 1;

    Game.Objects["Wizard tower"].minigame.spells["gambler's fever dream"].win =
        function () {
            var M = Game.Objects["Wizard tower"].minigame;
            var spells = [];
            var selfCost = M.getSpellCost(M.spells["gambler's fever dream"]);
            for (var i in M.spells) {
                if (
                    i != "gambler's fever dream" &&
                    M.magic - selfCost >= M.getSpellCost(M.spells[i]) * 0.5
                )
                    spells.push(M.spells[i]);
            }
            if (spells.length == 0) {
                Game.Popup(
                    '<div style="font-size:80%;">' +
                        loc("No eligible spells!") +
                        "</div>",
                    Game.mouseX,
                    Game.mouseY,
                );
                return -1;
            }
            var spell = choose(spells);
            var cost = M.getSpellCost(spell) * 0.5;
            setTimeout(
                (function (spell, cost, seed) {
                    return function () {
                        if (Game.seed != seed) return false;
                        var out = M.castSpell(spell, {
                            cost: cost,
                            failChanceMax: 0.5,
                            passthrough: true,
                        });
                        if (!out) {
                            M.magic += selfCost;
                            setTimeout(function () {
                                Game.Popup(
                                    '<div style="font-size:80%;">' +
                                        loc(
                                            "That's too bad!<br>Magic refunded.",
                                        ) +
                                        "</div>",
                                    Game.mouseX,
                                    Game.mouseY,
                                );
                            }, 1500);
                        }
                    };
                })(spell, cost, Game.seed),
                GFDLengthExtender.GFDLENGTH * 1000,
            );
            Game.Popup(
                '<div style="font-size:80%;">' +
                    loc("Casting %1<br>for %2 magic...", [
                        spell.name,
                        Beautify(cost),
                    ]) +
                    "</div>",
                Game.mouseX,
                Game.mouseY,
            );
        };

    GFDLengthExtender.minGFDtime = 1;
    GFDLengthExtender.maxGFDtime = 25;

    GFDLengthExtender.serializeSaves = () => {
        let saveData = { GFDLENGTH: GFDLengthExtender.GFDLENGTH };
        return JSON.stringify(saveData);
    };
    GFDLengthExtender.loadSaves = (saveData) => {
        let saveDataAsObject = JSON.parse(saveData);
        if (!saveDataAsObject || typeof saveDataAsObject != "object") {
            console.warn("Unknown save format.");
            //default?
            return;
        }

        if (!("GFDLENGTH" in saveDataAsObject)) {
            console.log("No predefined GFDLENGTH");
        } else {
            console.log(Game.modSaveData.GFDLengthExtender);
        }
        let version = void 0;
    };
    // GFDLengthExtender.save = () => {
    //     return GFDLengthExtender.serializeSaves()
    // }
    GFDLengthExtender.load = (str) => {
        GFDLengthExtender.GFDLENGTH = CCSE.config.OtherMods.GFDLengthExtender;
    };

    // RANDOM CCSE BS
    CCSE.customSave.push(function () {
        CCSE.config.OtherMods.GFDLengthExtender = GFDLengthExtender.GFDLENGTH;
    });
    CCSE.customLoad.push(function () {
        if (CCSE.config.OtherMods.GFDLengthExtender) {
            GFDLengthExtender.GFDLENGTH =
                CCSE.config.OtherMods.GFDLengthExtender;
            // GFDLengthExtender.onSliderInput(GFDLengthExtender.GFDLENGTH);
        } else {
            GFDLengthExtender.GFDLENGTH = 1;
        }
    });

    GFDLengthExtender.onSliderChange = (v) => {
        document.getElementById("gfdSeconds").textContent = v;
        GFDLengthExtender.GFDLENGTH = v;
    };
    GFDLengthExtender.onSliderInput = (v) => {
        document.getElementById("gfdSeconds").textContent = v;
    };

    GFDLengthExtender.menuFunction = () => {
        return CCSE.AppendOptionsMenu(`
            <div class="title">GFD length extender</div>
            <div class="listing">
                <div class="sliderBox">
                    <div style="float:left;" class="smallFancyButton">How many seconds GFD should take to cast (in seconds)</div>
                    <div style="float:right;" class="smallFancyButton" id="gfdSeconds">
                        ${GFDLengthExtender.GFDLENGTH}
                    </div>
                    <input class="slider" id="gfdSecondsSlider"
                        style="clear:both;"
                        type="range" min="${GFDLengthExtender.minGFDtime}" max="${GFDLengthExtender.maxGFDtime}" step="1"
                        value="${GFDLengthExtender.GFDLENGTH}"
                        onchange="GFDLengthExtender.onSliderChange(this.value)"
                        oninput="GFDLengthExtender.onSliderInput(this.value)"
                        onmouseup="PlaySound('snd/tick.mp3');">
                </div>
            </div>`);
    };

    Game.customOptionsMenu.push(GFDLengthExtender.menuFunction);
    GFDLengthExtender.isLoaded = 1;
};

if (!GFDLengthExtender.isLoaded) {
    if (CCSE && CCSE.isLoaded) {
        GFDLengthExtender.begin();
    } else {
        if (!CCSE) var CCSE = {};
        if (!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
        CCSE.postLoadHooks.push(GFDLengthExtender.begin);
    }
}
