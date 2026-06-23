from pathlib import Path
from zipfile import ZipFile as zipper, ZIP_DEFLATED, ZIP_STORED
from os import sep as pathSeperator, system as executeOnCMD, name as operatingSystemName
from variables import *

#for unit tests
import subprocess


#================================================================================================
# PLEASE GO TO "variables.py" AND ADJUST ANY REQUIRED VARIABLES BEFORE STARTING (clearly labeled)
# ADITIONALY, THIS CURRENTLY ONLY WORKS ON WINDOWS (I will probably not patch for linux)
#================================================================================================

class unitTestFuncs: #i like to just make them small since i usualy have a lot
    def endFileOnTest(filename: str) -> str: 
        return PATH_TO_TEMP_OUTPUT + "/" + filename

    def getUserConfirmation(forWhat: str) -> bool:
        print(forWhat)
        answer = input("[y/n]")
        
        answer = answer.lower()
        
        if answer == "y" or answer == "j":
            return True
        elif answer == "n":
            return False
        else:
            return None

    def clear() -> None:
        executeOnCMD('cls' if operatingSystemName == 'nt' else 'clear')

    def continueOnEnter() -> None:
        input("Press enter to continue")

    def runSingleUnitTest() -> bool:
        try:
            result = subprocess.run(
                [rf"{PATH_TO_GENERATOR}"],
                capture_output=True,
                input="\n",
                text=True,
                check=True,
                timeout=15
            )
            return True
        except (subprocess.TimeoutExpired, subprocess.CalledProcessError):
            return False





#Create/update the apworld (does not work lol, idk what on the zipping fails but AP cant work with it)
unitTestFuncs.clear()
# with zipper(PATH_TO_CUSTOMWORLDS + "/cookieclicker.apworld", "w", ZIP_STORED) as zip:
#     for file in sorted(Path(PATH_TO_CC).rglob("*")):
#         if file.is_file():
#             zip.write(file, file.relative_to(Path(PATH_TO_CC)))


#Start testing
if unitTestFuncs.getUserConfirmation(VALID_YAML_STR):
    while True: # MAIN LOOP
        unitTestFuncs.clear()
        print("Which tests should be tested?")
        for i in range(1, len(LIST_OF_OPTIONS)+1):
            print(f"[{i}] {LIST_OF_OPTIONS[i-1]}")
        print("\n[0] Exit")
        
        while True:
            try:
                choice = int(input("Please enter Number: "))
                break
            except ValueError:
                unitTestFuncs.clear()
                print("Not a Valid Number!\n\n")
        
        if choice == 0:
            unitTestFuncs.clear()
            print("Hope your results were what you hoped for...")
            break
        elif choice == 1:
            unitTestFuncs.clear()
            failedGens = 0
            attemptedGens = 0
            compleatedGens = 0
            for loop in range(0, unitTestCount):
                unitTestFuncs.clear()
                print("===================================================================")
                print("This might take a while (You can do something else whilst you wait)")
                print(f"TESTS COMPLEATED: {loop+1}/{unitTestCount}")
                print("===================================================================")
                attemptedGens += 1
                try:
                    subprocess.run(
                        [rf"{PATH_TO_GENERATOR}"],
                        capture_output=True,
                        input="\n",
                        text=True,
                        check=True,
                        timeout=15
                    )
                except (subprocess.TimeoutExpired, subprocess.CalledProcessError):
                    failedGens += 1
            unitTestFuncs.clear()
            print("RESULTS DONE!")
            print(f"FAILS: {failedGens}/{attemptedGens} (about {failedGens/attemptedGens*100}% Failed)")
            unitTestFuncs.continueOnEnter()