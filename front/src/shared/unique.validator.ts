import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function uniqueValidator(field: string, list: string[]): ValidatorFn {
	return (ctrl: AbstractControl): null | ValidationErrors => {
		if (!ctrl.parent?.get(field)) {
			return null;
		}
		if (list.indexOf(ctrl.parent.get(field)?.value) < 0) {
			return null;
		} else {
			return {
				unique: ctrl.parent.get(field)?.value
			};
		}
	};
}
