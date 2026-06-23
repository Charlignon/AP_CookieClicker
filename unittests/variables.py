#Incase anyone else uses this: please update the following variable/Variables to your own path
pathToArchipelago = "F:/Archipelago"

#unit-test Variables
unitTestCount = 20          #How many tests should the unit test do?
unitTestTimeout = 15        #How many seconds untill it counts the gen attempt as failed
maxParalellExectuions = 8   #The Max Amount of generations the unit tests may have running at once



#CONSTANTS, DO NOT CHANGE

#Strings
VALID_YAML_STR = ("Is there a Valid YAML File for Cookie clicker in the players folder (preferably ONLY for CC)\n"
            + "Additionaly, is the APWORLD on the version you want to test (you can update both right now before confirming)")




#Paths
PATH_TO_CUSTOMWORLDS = pathToArchipelago + "/custom_worlds"
PATH_TO_GENERATOR = pathToArchipelago + "/ArchipelagoGenerate.exe"
PATH_TO_CC = "./cookieclicker"
PATH_TO_TEMP_OUTPUT = "./unittests/output_Test"
PATH_TO_UNIT_TEST_RESULTS = "./unittests/output_UnitTests"

LIST_OF_OPTIONS = [
    "start General Unit Tests (generates a lot of seeds)",
]