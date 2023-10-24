import json
from z3 import *
import sys

# Create a Z3 solver instance
solver = Solver()

values_inputted = json.loads(sys.argv[1])
truth_values = values_inputted.get("truth_values")
first_result = values_inputted.get("first_result")

# Define constants
year = BoolVal(truth_values['year_external'])
ldv = BoolVal(truth_values['LDV_external'])
ldt = BoolVal(truth_values['LDT_external'])
mdpv = BoolVal(truth_values['MDPV_external'])
ac = BoolVal(truth_values['ac_external'])
sc03 = BoolVal(truth_values['sc03_external'])
five_cycle_test = BoolVal(truth_values['fiveCycleTest_external'])
five_cycle_type_alt = BoolVal(truth_values['fiveCycleTypeAlt_external'])
five_cycle_type_duel = BoolVal(truth_values['fiveCycleTypeDuel_external'])
five_cycle_type_elec = BoolVal(truth_values['fiveCycleTypeElec_external'])
substitution = BoolVal(truth_values['substitution_external'])
E_fuel = BoolVal(truth_values['e10_external'])
hydrocarbon = BoolVal(truth_values['hydrocarbon_external'])
pmftp = BoolVal(truth_values['pmftp_external'])
pmus = BoolVal(truth_values['pmus06_external'])
co = BoolVal(truth_values['co_external'])
formaldehyde = BoolVal(truth_values['formaldehyde_external'])
low_alt = BoolVal(truth_values['altitude_external'])

# Define constant symbols for functions
law_applies_neg_year = Bool('law_applies_neg_year')
law_applies_neg_vehicle = Bool('law_applies_neg_vehicle')
test_correct_neg_AC_testing = Bool('test_correct_neg_AC_testing')
test_correct_neg_substitution = Bool('test_correct_neg_substitution')
test_correct_neg_E10 = Bool('test_correct_neg_E10')
test_correct_neg_low_alt = Bool('test_correct_neg_low_alt')
test_passed_neg_hydro = Bool('test_passed_neg_hydro')
test_passed_neg_pmftp = Bool('test_passed_neg_pmftp')
test_passed_neg_pmus = Bool('test_passed_neg_pmus')
test_passed_neg_co = Bool('test_passed_neg_co')
test_passed_neg_formaldehyde = Bool('test_passed_neg_formaldehyde')

# Define constraints
solver.add(law_applies_neg_year == Not(year))
solver.add(law_applies_neg_vehicle == Not(Or(ldv, ldt, mdpv)))
solver.add(test_correct_neg_AC_testing == Not(Or(Not(ac), sc03, And(Or(five_cycle_test, five_cycle_type_alt, five_cycle_type_duel, five_cycle_type_elec)))))
solver.add(test_correct_neg_substitution == Not(Or(Not(ac), And(Or(five_cycle_test, five_cycle_type_alt, five_cycle_type_duel, five_cycle_type_elec), Or(sc03, substitution)))))
solver.add(test_correct_neg_E10 == Not(E_fuel))
solver.add(test_correct_neg_low_alt == Not(low_alt))
solver.add(test_passed_neg_hydro == Not(hydrocarbon))
solver.add(test_passed_neg_pmftp == Not(pmftp))
solver.add(test_passed_neg_pmus == Not(pmus))
solver.add(test_passed_neg_co == Not(co))
solver.add(test_passed_neg_formaldehyde == Not(formaldehyde))

# Check satisfiability
result = solver.check()

if result == sat:
    model = solver.model()
    result_data = {
        "status": "Satisfiable",
        "model": {str(v): str(model[v].as_bool()) if is_bool(v) else str(model[v]) for v in model}
    }
else:
    result_data = {"status": "Unsatisfiable"}

# Find what went wrong
if(first_result.get("model") is None):
    raise Exception("Unsatisfiable: means that Z3 code in Python file is wrong.")
elif(first_result.get("model").get("motor_vehicle_emissions_problem") is None):
    raise Exception("No solution found in model.")
elif(first_result.get("model").get("motor_vehicle_emissions_problem") == "True"):
    print(json.dumps(result))
elif(first_result.get("model").get("law_applies") is None):
    raise Exception("Unknown if law applies to this scenario.")
elif(first_result.get("model").get("law_applies") == "False"):
    if(result_data.get("model").get("law_applies_neg_year") == "True"):
        result_data["failure"] = "The vehicle year is prior to 2017. These regulations do not apply to this vehicle."
    else:
        result_data["failure"] = "This vehicle is not a light-duty vehicle, light-duty truck, or medium-duty passenger vehicle. These regulations do not apply to this vehicle."
elif(first_result.get("model").get("test_correct") is None):
    raise Exception("Unknown if the test was done correctly.")
elif(first_result.get("model").get("test_correct") == "False"):
    if(result_data.get("model").get("test_correct_neg_AC_testing") == "True"):
        result_data["failure"] = "If the vehicle has air conditioning and does not qualify for derived 5-cycle testing, it must be tested with the SC03 driving cycle. This vehicle has not been tested with the SC03 driving cycle."
    elif(result_data.get("model").get("test_correct_neg_substitution") == "True"):
        result_data["failure"] = "If the vehicle qualifies for derived 5-cycle testing and the vehicle has AC, when calculating the SFTP value, either the SC03 value can be used or the FTP value must be substituted for the SC03 value. This vehicle is not using either of these when calculating the SFTP value."
    elif(result_data.get("model").get("test_correct_neg_E10") == "True"):
        result_data["failure"] = "The testing must be done with E10 fuel."
    else:
        result_data["failure"] = "The testing must be done in low-altitude conditions, which is defined as 4000 feet or less above sea level. This vehicle was tested in high-altitude conditions."
elif(first_result.get("model").get("test_passed") is None):
    raise Exception("Unknown if the test was passed.")
elif(first_result.get("model").get("test_passed") == "False"):
    if(result_data.get("model").get("test_passed_neg_hydro") == "True"):
        result_data["failure"] = "Combined hydrocarbon, nitric oxide, and nitrogen dioxide emissions for the vehicle must be equal to or below 0.050 g/mi. The emissions for this vehicle exceeds this number."
    elif(result_data.get("model").get("test_passed_neg_pmftp") == "True"):
        result_data["failure"] = "Particulate matter emissions for the vehicle must be equal to or below 0.003 g/mi when tested with the FTP driving schedule. The emissions for this vehicle exceeds this number."
    elif(result_data.get("model").get("test_passed_neg_pmus") == "True"):
        result_data["failure"] = "Particulate matter emissions for the vehicle must be equal to or below 0.006 g/mi when tested with the SC06 driving schedule. The emissions for this vehicle exceeds this number."
    elif(result_data.get("model").get("test_passed_neg_co") == "True"):
        result_data["failure"] = "Carbon monoxide emissions for the vehicle must be equal to or below 4.2 g/mi when tested with the SFTP driving schedule. The emissions for this vehicle exceeds this number."
    else:
        result_data["failure"] = "Formaldehyde emissions for the vehicle must be equal to or below 0.004 g/mi when tested with the FTP driving schedule. The emissions for this vehicle exceeds this number."
else:
    raise Exception("Unknown what failed in determining compliance.")
print(json.dumps(result_data))
