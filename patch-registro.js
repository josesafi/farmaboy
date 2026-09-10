const fs = require('fs');
const file = 'src/app/registro/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Remove authMethod
code = code.replace(/const \[authMethod, setAuthMethod\] = useState<"correo" \| "celular">\("correo"\);\n/g, '');

// 2. Fix validate
code = code.replace(/if \(authMethod === "correo"\) \{\n\s*if \(\!formData\.email\.trim\(\) \|\| \!formData\.email\.includes\("@"\)\) \{\n\s*errs\.email = "Ingresa un correo electr贸nico v谩lido\.";\n\s*\}\n\s*\}/g, 'if (!formData.email.trim() || !formData.email.includes("@")) {\n        errs.email = "Ingresa un correo electr髇ico v醠ido.";\n      }');

// 3. Fix handleSubmit
code = code.replace(/\/\/ Si eligi贸 correo, enviamos un OTP real al correo\n\s*if \(authMethod === "correo" && formData\.email\) \{/g, '// Enviamos OTP real al correo\n    if (formData.email) {');
code = code.replace(/\} else \{\n\s*\/\/ Cellular demo\n\s*alert\(MODO DEMO: Como no hay una API de WhatsApp o SMS conectada, puedes ingresar cualquier c贸digo de 6 d铆gitos \(ej\. 123456\) para continuar\.'\);\n\s*\}/g, '');
code = code.replace(/\} else \{\n\s*\/\/ Cellular demo\n\s*alert\(MODO DEMO.*\);\n\s*\}/g, '');

// 4. Fix handleVerifyOtp
code = code.replace(/email: authMethod === "correo" \? formData\.email : undefined,/g, 'email: formData.email,');

// 5. Remove toggle UI
code = code.replace(/<div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold">[\s\S]*?<\/div>/, '');

// 6. Fix Correo Electr贸nico label
code = code.replace(/Correo Electr贸nico \{authMethod === "correo" \? "\*" : "\(Opcional\)"\}/g, 'Correo Electr髇ico *');

// 7. Fix Verification message
code = code.replace(/\{authMethod === "celular" \? \([\s\S]*?\) : null\}/g, '');

fs.writeFileSync(file, code);
console.log('Patched registro');
