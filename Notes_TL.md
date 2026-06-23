# Ideas For Pull Requests
- Progressive Sugar Lump Time Option (including Unlock on First Gain of it)
- Clicker Option {What did i mean?}

# goals
## MAIN
- Cookie Baker (Reach X Cookies Baked Lifetime)
- Speed Baker (Reach X Base-CPS (unboosted CPS))
- Dragon% (Win By Maxing Out Crumblor)

## JOKE
- one of many (From a check, receive a Victory-Cookie item which just lets you win or lets you buy your victory inside the Upgrade shop (for like 1 cookie))
- Just plain Lucky (Victory upon getting the just plain Lucky Achievement)
- Clique% (Big cookie is locked behind a item, win when you gain a single cookie (from clicking) [Should Possibly also just give 1 or 2 checks instead of the 400+ CC currently has])
- Transend Any% (Victory on gaining a single heavenly Level)



# NOTE
Return to fillers, you did not implement it correctly (visual)




# Creation of AP items:
let allUpgrades = Game.Upgrades
for upgrade in allUpgrades >> if upgrade.pool != "" continue (aka skip)




# Others
upgrade list gen:
stringOfThings = """<String copy-pasted from doku>"""

for item in stringOfThings.split("\n"):
    print(f"    CCUpgradeCheck({item.split("\t")[0]}, \"{item.split("\t")[1]}\", -1),")


<div id="apUpgrades" class="storeSection upgradeBox" css="#apUpgrades:before{content: 'AP Shop'}">
    All Of the AP-Items go here
</div>