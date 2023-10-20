import json
from z3 import *
import sys

# Create a Z3 solver instance
solver = Solver()

truth_values = json.loads(sys.argv[1])

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
law_applies = Bool('law_applies')
test_correct = Bool('test_correct')
test_passed = Bool('test_passed')
motor_vehicle_emissions_problem = Bool('motor_vehicle_emissions_problem')

# Define constraints
solver.add(law_applies == Or(And(year, Or(ldv, ldt, mdpv))))
solver.add(test_correct == And(And(Or(Not(ac), sc03, And(Or(five_cycle_test, five_cycle_type_alt, five_cycle_type_duel, five_cycle_type_elec), substitution)), E_fuel, low_alt)))
solver.add(test_passed == And(And(And(hydrocarbon, pmftp, pmus), co, formaldehyde)))
solver.add(motor_vehicle_emissions_problem == And(law_applies, test_correct, test_passed))

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

print(json.dumps(result_data))
