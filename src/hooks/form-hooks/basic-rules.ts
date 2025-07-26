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

function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function useRule<T>(initialValue: T, isRequired = true) {
  const rule = ref({
    value: initialValue,
    required: isRequired,
    disabled: false,
    visible: true,
    errMsg: '',

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(changeMes = true): boolean {
      // 提供重写覆盖，默认清除错误，验证通过

      if (isEmpty(this.value)) {
        this.errMsg = '请根据提示正确输入内容，且不为空';
        return false;
      }
      return true;
    },
  });

  return rule;
}
