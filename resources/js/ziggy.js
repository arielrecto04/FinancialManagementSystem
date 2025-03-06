const Ziggy = {"url":"http:\/\/localhost","port":null,"defaults":{},"routes":{"sanctum.csrf-cookie":{"uri":"sanctum\/csrf-cookie","methods":["GET","HEAD"]},"dashboard":{"uri":"dashboard","methods":["GET","HEAD"]},"statistics":{"uri":"statistics","methods":["GET","HEAD"]},"expenses.index":{"uri":"expenses","methods":["GET","HEAD"]},"expenses.create":{"uri":"expenses\/create","methods":["GET","HEAD"]},"expenses.store":{"uri":"expenses","methods":["POST"]},"expenses.show":{"uri":"expenses\/{expense}","methods":["GET","HEAD"],"parameters":["expense"]},"expenses.edit":{"uri":"expenses\/{expense}\/edit","methods":["GET","HEAD"],"parameters":["expense"]},"expenses.update":{"uri":"expenses\/{expense}","methods":["PUT","PATCH"],"parameters":["expense"],"bindings":{"expense":"id"}},"expenses.destroy":{"uri":"expenses\/{expense}","methods":["DELETE"],"parameters":["expense"],"bindings":{"expense":"id"}},"reports.index":{"uri":"reports","methods":["GET","HEAD"]},"reports.export.excel":{"uri":"reports\/export\/excel","methods":["GET","HEAD"]},"reports.export.pdf":{"uri":"reports\/export\/pdf","methods":["GET","HEAD"]},"reports.update-status":{"uri":"reports\/{id}\/update-status","methods":["POST"],"parameters":["id"]},"profile.edit":{"uri":"profile","methods":["GET","HEAD"]},"profile.update":{"uri":"profile","methods":["PATCH"]},"profile.destroy":{"uri":"profile","methods":["DELETE"]},"request.form":{"uri":"request-form","methods":["GET","HEAD"]},"request.supply.store":{"uri":"request\/supply","methods":["POST"]},"request.reimbursement.store":{"uri":"request\/reimbursement","methods":["POST"]},"register":{"uri":"register","methods":["GET","HEAD"]},"login":{"uri":"login","methods":["GET","HEAD"]},"password.request":{"uri":"forgot-password","methods":["GET","HEAD"]},"password.email":{"uri":"forgot-password","methods":["POST"]},"password.reset":{"uri":"reset-password\/{token}","methods":["GET","HEAD"],"parameters":["token"]},"password.store":{"uri":"reset-password","methods":["POST"]},"verification.notice":{"uri":"verify-email","methods":["GET","HEAD"]},"verification.verify":{"uri":"verify-email\/{id}\/{hash}","methods":["GET","HEAD"],"parameters":["id","hash"]},"verification.send":{"uri":"email\/verification-notification","methods":["POST"]},"password.confirm":{"uri":"confirm-password","methods":["GET","HEAD"]},"password.update":{"uri":"password","methods":["PUT"]},"logout":{"uri":"logout","methods":["POST"]},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
