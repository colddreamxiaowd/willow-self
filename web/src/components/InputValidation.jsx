import React, { memo, useCallback, useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import './InputValidation.css';

const VALIDATION_RULES = {
  description: {
    required: true,
    minLength: 2,
    maxLength: 100,
    messages: {
      required: '请描述一下这个目标或行动',
      minLength: '描述太短了，再详细一点吧',
      maxLength: '描述太长了，简化一下吧',
    },
  },
  coupling_score: {
    required: true,
    min: 1,
    max: 10,
    messages: {
      required: '请选择带动性评分',
      min: '带动性最低是1',
      max: '带动性最高是10',
    },
  },
  resistance_score: {
    required: true,
    min: 1,
    max: 10,
    messages: {
      required: '请选择阻力评分',
      min: '阻力最低是1',
      max: '阻力最高是10',
    },
  },
  maintenance_cost: {
    required: true,
    min: 1,
    max: 10,
    messages: {
      required: '请选择维持成本评分',
      min: '维持成本最低是1',
      max: '维持成本最高是10',
    },
  },
  node_type: {
    required: true,
    allowedValues: ['ROOT', 'GOAL', 'ACTION'],
    messages: {
      required: '请选择节点类型',
      allowedValues: '节点类型必须是 ROOT、GOAL 或 ACTION',
    },
  },
};

const SUGGESTIONS = {
  description: {
    empty: '试试描述你想改变什么，或者想做什么事',
    tooShort: '可以加上"为什么想做这件事"或"希望达到什么效果"',
    good: '描述得很清楚！',
  },
  coupling_score: {
    low: '带动性低的事比较独立，适合单独完成',
    medium: '带动性中等，会有一些连锁效果',
    high: '带动性高的事像多米诺骨牌，做一个带动很多个！',
  },
  resistance_score: {
    low: '阻力低的事很容易开始，适合作为起点',
    medium: '中等阻力，需要一点意志力',
    high: '阻力高的事需要更多准备，可以尝试分解成更小的步骤',
  },
  maintenance_cost: {
    low: '维持成本低，养成习惯后几乎不用管',
    medium: '需要定期关注，但不会太累',
    high: '维持成本高，需要持续投入精力',
  },
};

const validateField = (fieldName, value) => {
  const rules = VALIDATION_RULES[fieldName];
  if (!rules) return { valid: true };

  const errors = [];
  const warnings = [];
  const suggestions = [];

  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.push(rules.messages.required);
    suggestions.push(SUGGESTIONS[fieldName]?.empty || '');
    return { valid: false, errors, warnings, suggestions };
  }

  if (rules.minLength !== undefined && typeof value === 'string' && value.length < rules.minLength) {
    errors.push(rules.messages.minLength);
    suggestions.push(SUGGESTIONS[fieldName]?.tooShort || '');
  }

  if (rules.maxLength !== undefined && typeof value === 'string' && value.length > rules.maxLength) {
    warnings.push(rules.messages.maxLength);
  }

  if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
    errors.push(rules.messages.min);
  }

  if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
    errors.push(rules.messages.max);
  }

  if (rules.allowedValues && !rules.allowedValues.includes(value)) {
    errors.push(rules.messages.allowedValues);
  }

  if (errors.length === 0 && warnings.length === 0) {
    if (typeof value === 'number') {
      if (value <= 3) suggestions.push(SUGGESTIONS[fieldName]?.low || '');
      else if (value <= 6) suggestions.push(SUGGESTIONS[fieldName]?.medium || '');
      else suggestions.push(SUGGESTIONS[fieldName]?.high || '');
    } else if (typeof value === 'string' && value.length >= 5) {
      suggestions.push(SUGGESTIONS[fieldName]?.good || '');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
};

const ValidationMessage = memo(function ValidationMessage({ 
  type = 'error',
  message,
  onDismiss 
}) {
  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info,
  };

  const IconComponent = icons[type] || Info;

  return (
    <div className={`validation-message ${type}`}>
      <IconComponent size={14} className="message-icon" />
      <span className="message-text">{message}</span>
      {onDismiss && (
        <button className="message-dismiss" onClick={onDismiss}>
          <X size={12} />
        </button>
      )}
    </div>
  );
});

const InputValidation = memo(function InputValidation({
  fieldName,
  value,
  showValidation = true,
  showSuggestions = true,
  onValidationChange,
  children,
}) {
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState({ valid: true });

  useEffect(() => {
    const validationResult = validateField(fieldName, value);
    setResult(validationResult);
    if (onValidationChange) {
      onValidationChange(validationResult);
    }
  }, [fieldName, value, onValidationChange]);

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  const getStatusClass = () => {
    if (!touched || !showValidation) return '';
    if (result.errors?.length > 0) return 'invalid';
    if (result.warnings?.length > 0) return 'warning';
    return 'valid';
  };

  return (
    <div className={`input-validation-wrapper ${getStatusClass()}`}>
      <div className="input-container" onBlur={handleBlur}>
        {children}
      </div>

      {touched && showValidation && (
        <div className="validation-feedback">
          {result.errors?.map((error, index) => (
            <ValidationMessage 
              key={`error-${index}`}
              type="error"
              message={error}
            />
          ))}

          {result.warnings?.map((warning, index) => (
            <ValidationMessage 
              key={`warning-${index}`}
              type="warning"
              message={warning}
            />
          ))}
        </div>
      )}

      {showSuggestions && result.suggestions?.length > 0 && touched && result.valid && (
        <div className="validation-suggestions">
          {result.suggestions.map((suggestion, index) => (
            suggestion && (
              <ValidationMessage 
                key={`suggestion-${index}`}
                type="info"
                message={suggestion}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
});

const FormValidationSummary = memo(function FormValidationSummary({ 
  fields = [],
  showOnlyErrors = false 
}) {
  const allResults = fields.map(({ name, value }) => ({
    name,
    ...validateField(name, value),
  }));

  const errors = allResults.filter(r => !r.valid);
  const warnings = allResults.filter(r => r.warnings?.length > 0);

  if (errors.length === 0 && warnings.length === 0) {
    return (
      <div className="validation-summary success">
        <CheckCircle size={16} />
        <span>所有字段都已正确填写！</span>
      </div>
    );
  }

  if (showOnlyErrors && errors.length === 0) {
    return null;
  }

  return (
    <div className="validation-summary">
      {errors.length > 0 && (
        <div className="summary-section errors">
          <AlertCircle size={16} />
          <span>{errors.length} 个字段需要修改</span>
        </div>
      )}
      {!showOnlyErrors && warnings.length > 0 && (
        <div className="summary-section warnings">
          <AlertTriangle size={16} />
          <span>{warnings.length} 个字段有建议</span>
        </div>
      )}
    </div>
  );
});

const useValidation = (fieldName, initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState({ valid: true });

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
    const validationResult = validateField(fieldName, newValue);
    setResult(validationResult);
  }, [fieldName]);

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setTouched(false);
    setResult({ valid: true });
  }, [initialValue]);

  return {
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    touched,
    result,
    reset,
    isValid: result.valid,
    errors: result.errors || [],
    warnings: result.warnings || [],
    suggestions: result.suggestions || [],
  };
};

export {
  validateField,
  ValidationMessage,
  FormValidationSummary,
  useValidation,
  VALIDATION_RULES,
  SUGGESTIONS,
};

export default InputValidation;

// 最后更新时间: 2026-02-21 19:25
// 编辑人: Trae AI
// 说明: 实时输入验证组件，提供友好的错误提示和建议
