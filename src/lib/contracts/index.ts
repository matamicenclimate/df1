import { setupClient } from "../algorand"
import auction from './teal/auction.teal'

export async function create_auction(vars: any) {
  const compiled = await get_contract_compiled(auction, vars)
  return new Uint8Array(Buffer.from(compiled.result, "base64"))
}

export async function populate_contract(template: string, vars: any) {
  //Read the program, Swap vars, spit out the filled out tmplate
  let program = await get_file(template)
  for (const key in vars) {
    const val = vars[key]
    program = program.replace(new RegExp(key, "g"), val)
  }
  return program
}
export async function get_contract_compiled(template: string, vars: any) {
  const client = setupClient()
  const populated = await populate_contract(template, vars)
  return client.compile(populated).do()
}

function checkStatus(response: any) {
  if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  return response;
}

export async function get_file(program: any) {
  return await fetch(program)
    .then(response => checkStatus(response) && response.arrayBuffer())
    .then(buffer => {
      const td = new TextDecoder()
      return td.decode(buffer)
    }).catch(err => {
      console.error(err)
      return ""
    });
}
