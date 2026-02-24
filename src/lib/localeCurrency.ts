export interface CurrencyOption {
  code: string
  label: string
}

const CURRENCIES: CurrencyOption[] = [
  { code: 'ARS', label: 'ARS' },
  { code: 'USD', label: 'USD' },
]

/** Moneda por defecto para nuevos listings. */
export function getLocaleCurrencyCode(): string {
  return 'ARS'
}

/** Lista de monedas para el selector: ARS y USD. */
export function getLocaleCurrencies(): CurrencyOption[] {
  return CURRENCIES
}
