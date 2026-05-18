export interface R6Operator {
  id: string       // e.g. 'ace'
  name: string     // e.g. 'Ace'
  role: 'Attacker' | 'Defender' | 'Recruit'
}

export interface R6Player {
  id: string
  name: string
  status?: string
  operators: R6Operator[]   // up to 4 operators
  mainOpKeys?: string[]     // keys of favorite/main operators
}
