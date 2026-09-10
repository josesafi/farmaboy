const fs = require('fs');
const file = 'src/app/login/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Remove mode and otpMode states
code = code.replace(/const \[mode, setMode\] = useState<"correo" \| "celular">\("correo"\);\n/g, '');
code = code.replace(/const \[otpMode, setOtpMode\] = useState\(false\);\n/g, '');
code = code.replace(/const \[otpCode, setOtpCode\] = useState\(""\);\n/g, '');

// 2. Fix handleSubmit
const submitBlock = \  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Ingresa tu correo o celular.");
      return;
    }

    if (!password.trim()) {
      setError("Ingresa tu contraseña.");
      return;
    }

    setIsLoading(true);
    await login(identifier, password);
    setIsLoading(false);
    router.push("/mi-cuenta");
  };\;
code = code.replace(/const handleSubmit = async[\s\S]*?router\.push\("\/mi-cuenta"\);\n  \};/, submitBlock);

// 3. Remove Mode Switcher UI
code = code.replace(/\{\/\* Mode Switcher \*\/\}\n\s*<div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold">[\s\S]*?<\/div>\n\n/g, '');

// 4. Clean up form labels
code = code.replace(/\{mode === "correo" \? "Correo ElectrÃ³nico" : "NÃºmero de Celular"\}/g, 'Correo Electrónico');
code = code.replace(/type=\{mode === "correo" \? "email" : "tel"\}/g, 'type="email"');
code = code.replace(/placeholder=\{mode === "correo" \? "ejemplo@correo\.com" : "312 000 0000"\}/g, 'placeholder="ejemplo@correo.com"');
code = code.replace(/\{mode === "correo" \? \(\n\s*<Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" \/>\n\s*\) : \(\n\s*<Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" \/>\n\s*\)\}/g, '<Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />');

// 5. Remove ternary mode === "correo"
code = code.replace(/\{mode === "correo" \? \([\s\S]*?\) : otpMode \? \([\s\S]*?<\/div>\n\s*\) : null\}/, \<div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Contraseña
                  </label>
                  <Link
                    href="/recuperar-cuenta"
                    className="text-[11px] font-bold text-[#00A86B] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#00A86B] text-xs font-medium outline-none focus:ring-2 focus:ring-[#00A86B]/20"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>\);

// 6. Fix Button Loading State
code = code.replace(/\{isLoading \? \([\s\S]*?<\/button>/, \{isLoading ? (
                "Verificando..."
              ) : (
                <>
                  <span>Ingresar a Mi Cuenta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>\);

fs.writeFileSync(file, code);
console.log('Patched login');
