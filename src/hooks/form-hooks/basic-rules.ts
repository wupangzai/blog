import { ref } from 'vue';

interface DuckRule {
  validate: (changeMes?: boolean) => boolean;
}

export class Form {
  // changeMes 校验时，是否修改提示信息
  static syncValidateRules(rules: DuckRule[], changeMes = true) {
    return rules.every((rule) => rule.validate(changeMes));
  }

  static async validateRules(...rules: DuckRule[]): Promise<boolean> {
    let isValid = true;
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const result = await rule.validate();

      if (!result) {
        isValid = false;
      }
    }
    return isValid;
  }
}

export function useRule<T>(initialValue: T, isRequired = true) {
  const rule = ref({
    value: initialValue,
    required: isRequired,
    disabled: false,
    visible: true,
    errMsg: '',

    validate(changeMes = true): boolean {
      // 提供重写覆盖，默认清除错误，验证通过

      if (changeMes) {
        this.errMsg = '';
      }
      return true;
    },
  });

  return rule;
}
