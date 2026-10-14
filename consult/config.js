// Activation is a separate, owner-approved production change.
// Ordinary visitors cannot submit. The explicit test view accepts only fixed fake values.
window.SALESAID_CONSULT={enabled:new URLSearchParams(location.search).get('crm_test')==='1',testOnly:true,collectAttribution:false,endpoint:'https://mnrcbimzulxovbdnqctp.supabase.co/functions/v1/consult-submit',documentVersion:'consult-20261013-v1',documentHash:'eb2ce0f20ba1745ee5a7d8cbb077840e16e2b840702cd7f1914f3cde85eb77f4'};
