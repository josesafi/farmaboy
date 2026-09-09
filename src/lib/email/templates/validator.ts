export interface VariableValidationResult {
  isValid: boolean;
  usedVariables: string[];
  invalidVariables: string[];
  missingVariables: string[];
}

/**
 * Extracts all {{variable_name}} tokens from a string.
 */
export function extractVariables(templateString: string): string[] {
  const matches = templateString.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g);
  if (!matches) return [];
  const unique = new Set(matches.map((m) => m.replace(/[\{\}]/g, "").trim()));
  return Array.from(unique);
}

/**
 * Validates that template variables only contain allowed variables.
 */
export function validateTemplateVariables(
  templateString: string,
  allowedVariables: string[]
): VariableValidationResult {
  const used = extractVariables(templateString);
  const allowedSet = new Set(allowedVariables);

  const invalid = used.filter((v) => !allowedSet.has(v));

  return {
    isValid: invalid.length === 0,
    usedVariables: used,
    invalidVariables: invalid,
    missingVariables: [],
  };
}

/**
 * Replaces {{variable}} tokens in a template with data values.
 */
export function replaceVariables(
  templateString: string,
  data: Record<string, any>
): string {
  return templateString.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (_, key) => {
    if (data[key] !== undefined && data[key] !== null) {
      return String(data[key]);
    }
    return "";
  });
}
