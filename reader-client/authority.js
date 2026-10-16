// Independent implementation of the documented community authority contract.
export async function readAuthority(reader, eq, str) {
  const communities=[],grants=[];
  for(const type of ['community','organizer_grant']){
    const page=await reader.select().where(eq('protocol',str('common-ground:v1')),eq('entity_type',str(type))).limit(50).fetch();
    do{
      for(const e of page.entities){try{
        if(!e.creationFlags.readonly)continue;
        const p=e.toJson();if(!p||typeof p!=='object')continue;
        if(type==='community' && typeof p.slug==='string' && /^[a-z0-9-]{3,40}$/.test(p.slug) && typeof p.name==='string' && p.name.trim() && p.name.length<=80 && typeof p.description==='string' && p.description.trim() && p.description.length<=500 && e.attributes.community?.value===p.slug) communities.push({id:e.key,slug:p.slug,creator:e.creator});
        if(type==='organizer_grant' && typeof p.communityKey==='string' && /^0x[\da-f]{64}$/i.test(p.communityKey) && typeof p.organizer==='string' && /^0x[\da-f]{40}$/i.test(p.organizer) && ['grant','revoke'].includes(p.action) && e.attributes.community_key?.value===p.communityKey)grants.push({...p,creator:e.creator,block:e.createdAt});
      }catch{/* Malformed public records are ignored. */}}
      if(!page.hasNextPage())break;await page.next();
    }while(true);
  }
  return {communities,grants};
}
export function authorityLabel(publication, authority) {
  if(!authority)return 'Authorization unavailable';
  const c=authority.communities.find(c=>c.id===publication.communityKey && c.slug===publication.community);
  if(!c)return 'Independent publisher';
  if(publication.creator.toLowerCase()===c.creator.toLowerCase())return 'Authorized organizer';
  const g=authority.grants.filter(g=>g.communityKey===c.id && g.creator.toLowerCase()===c.creator.toLowerCase() && g.organizer.toLowerCase()===publication.creator.toLowerCase());
  if(!g.length)return 'Independent publisher';
  const block=g.reduce((a,b)=>a.block>b.block?a:b).block;
  return g.filter(g=>g.block===block).every(g=>g.action==='grant') ? 'Authorized organizer' : 'Independent publisher';
}
