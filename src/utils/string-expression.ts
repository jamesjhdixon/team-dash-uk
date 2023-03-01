import { re } from 're-template-tag';

const DOT_EXP_RE = re`[a-zA-Z_$][a-zA-z_$]*(\.[a-zA-Z_$][a-zA-z_$]*)*`;

/**
 * Parse an expression of the format X.Y[.Z] etc, that is used for interpolating a string
 * with values from a collection of local objects and their properties
 *
 * @returns function that will return the string to replace the expression with, given the context object containing all the named variables
 */
export function parseDotFormatExpression(expression: string) {
  const tokens = expression.split('.');

  return (context: any) => {
    let current = context;

    for (const t of tokens) {
      current = current[t];
    }
    return current;
  };
}

export function interpolateDotFormatString(text: string, context: any) {
  const reWithCurly = re`\{(${DOT_EXP_RE})\}`;

  return text.replace(reWithCurly, (_, p1) => {
    const exprFun = parseDotFormatExpression(p1);

    return exprFun(context);
  });
}
