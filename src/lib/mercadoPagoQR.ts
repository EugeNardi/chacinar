// Generar QR de Mercado Pago real
export function generateMercadoPagoQR(alias: string, amount: number, description: string = ''): string {
  // Formato de QR de Mercado Pago
  // https://www.mercadopago.com.ar/money-request/create?alias=ALIAS&amount=MONTO&description=DESCRIPCION
  
  const baseUrl = 'https://www.mercadopago.com.ar/money-request/create';
  const params = new URLSearchParams({
    alias: alias,
    amount: amount.toString(),
    ...(description && { description })
  });

  return `${baseUrl}?${params.toString()}`;
}

// Generar link de pago de Mercado Pago
export function generateMercadoPagoLink(alias: string, amount: number, description: string = ''): string {
  return generateMercadoPagoQR(alias, amount, description);
}

// Validar alias de Mercado Pago
export function isValidMercadoPagoAlias(alias: string): boolean {
  // Alias debe tener entre 6 y 20 caracteres
  // Solo letras, números, puntos y guiones
  const aliasRegex = /^[a-zA-Z0-9.-]{6,20}$/;
  return aliasRegex.test(alias);
}

// Validar CVU de Mercado Pago
export function isValidMercadoPagoCVU(cvu: string): boolean {
  // CVU debe tener exactamente 22 dígitos
  const cvuRegex = /^\d{22}$/;
  return cvuRegex.test(cvu);
}
