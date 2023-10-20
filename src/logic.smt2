(define-const year Bool true)
(define-const LDV Bool true)
(define-const LDT Bool false)
(define-const MDPV Bool false)
(define-const AC Bool false)
(define-const SC_schedule Bool true)
(define-const five_cycle Bool false)
(define-const E_fuel Bool true)
(define-const hydrocarbon Bool true)
(define-const PM_FTP Bool true)
(define-const PM_US Bool true)
(define-const CO Bool true)
(define-const formaldehyde Bool true)
(define-const low_alt Bool true)

(define-fun law_applies () Bool
  (or (and year (or (or LDV LDT MDPV)))))

(define-fun test_correct () Bool
  (and (and (or (or AC SC_schedule five_cycle) E_fuel) low_alt)))

(define-fun test_passed () Bool
  (and (and (and (and hydrocarbon PM_FTP PM_US) CO) formaldehyde)))

(define-fun motor_vehicle_emissions_problem () Bool
  (and law_applies test_correct test_passed))

(assert motor_vehicle_emissions_problem)
(check-sat)
