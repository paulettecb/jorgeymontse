"""Servidor de pruebas del sitio, para poder verlo y medirlo sin desplegar.

    python3 pruebas/servidor.py       # queda en http://127.0.0.1:8766

Sirve los archivos del repo tal cual e imita lo que en producción hacen
Netlify y sus funciones:

  * las reescrituras de netlify.toml (/panel, los links bonitos /paloma-cambron,
    y el 404 de /netlify/* y de las fotos originales),
  * /api/invitacion, /api/recado y /api/panel, con datos de mentiras en
    memoria —se reinician al reiniciar el servidor—,
  * la Edge Function de la vista previa, que mete el nombre del invitado en
    las etiquetas Open Graph,
  * y, lo más importante para no repetir errores viejos: Netlify Forms sólo
    se queda con los campos que ve escritos en index.html, así que este
    servidor los filtra igual. Un campo que estrene su `name` desde
    JavaScript se cae aquí como se caería allá.

La contraseña del panel es «prueba».
"""
import json, re, os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs
import os.path as _p
RAIZ = _p.dirname(_p.dirname(_p.abspath(__file__)))   # la raíz del repo
# misma fuente que la función: se lee del .mts para probar el archivo de verdad
src=open(os.path.join(RAIZ,'netlify/functions/invitados-datos.mts'),encoding='utf-8').read()
i0=src.index('INVITACIONES: Invitacion[] = [') + len('INVITACIONES: Invitacion[] = ')
cuerpo=src[i0:src.index('\n];', i0)+2]
cuerpo=re.sub(r'/\*.*?\*/', '', cuerpo, flags=re.S)   # fuera comentarios
cuerpo=re.sub(r'(\b)(id|saludo|pases|invitados|civil)(:)', r'\1"\2"\3', cuerpo)
cuerpo=re.sub(r',(\s*[\]}])', r'\1', cuerpo)          # fuera comas colgantes
DATOS={i['id']: i for i in json.loads(cuerpo)}
# estado en memoria, como los blobs de Netlify
ENVIOS={}
CIVIL={}
RESPUESTAS={}
RECADOS={}          # un recado por invitación, como el store `recados`
PLANTILLA=['\u00a1Nos casamos! \U0001f90d\n\n{nombre}, esta es tu invitaci\u00f3n:\n{link}\n\n'
           'Ah\u00ed viene todo: la iglesia, el sal\u00f3n, el itinerario y d\u00f3nde confirmarnos. '
           'El link es tuyo y ya trae apartados tus lugares.']
# confirmaciones de mentiras. Los tres casos de `privado`:
#   False = dio permiso · True = pidió privacidad · ausente = envío viejo
RSVPS=[{'id':'r1','creado':'2026-09-01','nombre':'Jorge Cambrón, Elsa Barrales','asiste':True,
        'personas':2,'acompanantes':'Elsa Barrales','alergias':'','telefono':'','cancion':'Elvis',
        'mensaje':'¡Ahí estaremos!\nNos da mucho gusto.','invitacion':'jorge-cambron','privado':False},
       {'id':'r2','creado':'2026-09-01','nombre':'Paulette Cambrón','asiste':True,'personas':1,
        'acompanantes':'','alergias':'Sin gluten','telefono':'','cancion':'','mensaje':'','invitacion':'','privado':False},
       {'id':'r3','creado':'2026-09-01','nombre':'Norma Barrales','asiste':False,'personas':1,
        'acompanantes':'','alergias':'','telefono':'','cancion':'','mensaje':'No podré, pero los quiero mucho.',
        'invitacion':'norma-barrales','privado':True},
       {'id':'r4','creado':'2026-08-20','nombre':'Fernanda Martínez, Óscar Rodríguez','asiste':True,'personas':2,
        'acompanantes':'Óscar Rodríguez','alergias':'','telefono':'','cancion':'',
        'mensaje':'Un mensaje viejo, de antes de que existiera la casilla.','invitacion':'fernanda-martinez'},
       {'id':'r5','creado':'2026-09-03','nombre':'Paloma Cambrón','asiste':True,'personas':1,
        'acompanantes':'','alergias':'','telefono':'','cancion':'',
        'mensaje':'Qué emoción. Que sea un día precioso y que se vayan a bailar hasta que amanezca.',
        'invitacion':'paloma-cambron','privado':False}]
# unos cuantos más, para ver el mosaico con recados de largos distintos
_MAS=[('Felicidades a los dos.', 'ana-cambron'),
      ('Qué bonito verlos llegar hasta aquí. Desde que se conocieron se les nota, y ya era hora de que lo hicieran oficial. Los queremos mucho y no nos lo perdemos por nada.', 'norma-cambron'),
      ('Ahí estaremos, con todo y baile.', 'oscar-barrales'),
      ('Nos da muchísimo gusto. Gracias por invitarnos a un día tan importante.', 'diana-barrales'),
      ('Los queremos.', 'luis-cambron'),
      ('Que sea el principio de todo lo bueno. Nos vemos en Morelia.', 'maria-barrales'),
      ('Jorge, cuídala mucho. Montse, cuídalo mucho. Y los dos cuiden a Raava, que es la que manda.', 'pablo-cambron'),
      ('Allá nos vemos, con los zapatos cómodos.', 'sofia-barrales')]
# alguien que contestó dos veces: el panel no la debe contar doble
RSVPS.insert(0, {'id':'r0','creado':'2026-09-05','nombre':'Paulette Cambrón','asiste':True,
                 'personas':1,'acompanantes':'','alergias':'','telefono':'','cancion':'',
                 'mensaje':'Prueba <3','invitacion':'paulette-cambron','privado':False})
for _n,(_t,_i) in enumerate(_MAS, start=6):
    RSVPS.append({'id':'r%d'%_n,'creado':'2026-09-%02d'%(3+_n),'nombre':_i.replace('-',' ').title(),
                  'asiste':True,'personas':1,'acompanantes':'','alergias':'','telefono':'','cancion':'',
                  'mensaje':_t,'invitacion':_i,'privado':False})
print('cargadas', len(DATOS), 'invitaciones')

SimpleHTTPRequestHandler.extensions_map['.ics'] = 'text/calendar'
class H(SimpleHTTPRequestHandler):
    def translate_path(self, p):
        from urllib.parse import unquote
        return os.path.join(RAIZ, unquote(urlparse(p).path).lstrip('/')) or RAIZ
    def do_POST(self):
        u=urlparse(self.path)
        if u.path=='/api/recado':
            n=int(self.headers.get('content-length',0)); c=json.loads(self.rfile.read(n) or b'{}')
            i=str(c.get('invitacion','')).strip().lower()
            if not re.fullmatch(r'[a-z0-9-]{1,60}', i or '') or i not in DATOS:
                b=json.dumps({'error':'no encontrada'}).encode(); code=404
            else:
                t=str(c.get('texto','')).strip()[:1200]
                if not t:
                    RECADOS.pop(i,None)
                    b=json.dumps({'ok':True,'recado':None}).encode(); code=200
                else:
                    antes=RECADOS.get(i)
                    RECADOS[i]={'invitacion':i,'texto':t,
                                'creado':(antes or {}).get('creado','2026-09-01T00:00:00.000Z'),
                                'actualizado':'2026-09-06T00:00:00.000Z'}
                    b=json.dumps({'ok':True,'recado':RECADOS[i]}).encode(); code=200
            self.send_response(code); self.send_header('content-type','application/json')
            self.send_header('content-length',str(len(b))); self.end_headers(); self.wfile.write(b); return
        if u.path=='/api/panel':
            n=int(self.headers.get('content-length',0)); cuerpo=json.loads(self.rfile.read(n) or b'{}')
            if cuerpo.get('clave')!='prueba':
                b=json.dumps({'error':'Contraseña incorrecta.'}).encode(); code=401
            else:
                invs=list(DATOS.values())
                # confirmaciones de mentiras: dos que vienen, una que no
                rs=list(RSVPS)
                acc=cuerpo.get('accion')
                if acc=='marcarEnvio':
                    i=str(cuerpo.get('id',''))
                    if not re.fullmatch(r'[a-z0-9-]{1,60}', i):
                        b=json.dumps({'error':'id inválido'}).encode(); code=400
                    else:
                        if cuerpo.get('deshacer'): ENVIOS.pop(i, None)
                        else: ENVIOS[i]={'por':str(cuerpo.get('por','alguien'))[:40],
                                         'cuando':'2026-09-02T18:00:00.000Z'}
                        b=json.dumps({'ok':True,'envios':ENVIOS}).encode(); code=200
                elif acc=='marcarCivil':
                    i=str(cuerpo.get('id',''))
                    if not re.fullmatch(r'[a-z0-9-]{1,60}', i):
                        b=json.dumps({'error':'id inválido'}).encode(); code=400
                    else:
                        if cuerpo.get('civil') is None: CIVIL.pop(i,None)
                        else: CIVIL[i]=bool(cuerpo.get('civil'))
                        b=json.dumps({'ok':True,'civil':CIVIL}).encode(); code=200
                elif acc=='libro':
                    # mismo armado que el `case 'libro'` de panel.mts
                    saludos={i['id']:i['saludo'] for i in invs}
                    nuevos=[{'de':saludos.get(r['invitacion'],r['invitacion']),'texto':r['texto'],
                             'cuando':r['creado'],
                             'editado':r['actualizado'] if r['actualizado']!=r['creado'] else None}
                            for r in RECADOS.values() if str(r.get('texto','')).strip()]
                    ya={r['invitacion'] for r in RECADOS.values()}
                    viejos=[{'de':str(saludos.get(r.get('invitacion',''),'') or r.get('nombre','')).strip(),
                             'texto':r['mensaje'],'cuando':r['creado'],'editado':None}
                            for r in rs if str(r.get('mensaje','')).strip()
                            and r.get('invitacion') not in ya]
                    todos=sorted(nuevos+viejos, key=lambda r: str(r['cuando']))
                    b=json.dumps({'recados':todos}).encode(); code=200
                elif acc=='guardarPlantilla':
                    t=str(cuerpo.get('plantilla',''))
                    if not t.strip(): b=json.dumps({'error':'la plantilla no puede ir vacía'}).encode(); code=400
                    else: PLANTILLA[0]=t[:2000]; b=json.dumps({'ok':True}).encode(); code=200
                else:
                    porNombre={', '.join(i['invitados']).strip().lower(): i['id'] for i in invs}
                    vistas=set()
                    for r in rs:
                        if r.get('invitacion'): vistas.add(r['invitacion']); continue
                        i=porNombre.get(str(r.get('nombre','')).strip().lower())
                        if not i or i in vistas: continue
                        r['invitacion']=i; vistas.add(i)
                        RESPUESTAS[i]={'asiste':r['asiste'],'personas':r['personas'],'cuando':r['creado']}
                    b=json.dumps({'rsvps':rs,'mesas':{'mesas':[{'id':'m1','nombre':'Mesa 1','capacidad':10}],'asignaciones':{}},
                                  'invitaciones':invs,'envios':ENVIOS,'plantilla':PLANTILLA[0],'civil':CIVIL,
                                  'recados':list(RECADOS.values())}).encode(); code=200
            self.send_response(code); self.send_header('content-type','application/json')
            self.send_header('content-length',str(len(b))); self.end_headers(); self.wfile.write(b); return
        if u.path=='/':
            from urllib.parse import parse_qsl
            n=int(self.headers.get('content-length',0))
            d=dict(parse_qsl(self.rfile.read(n).decode('utf-8')))
            # Netlify Forms sólo se queda con los campos que vio en el HTML
            html=open(os.path.join(RAIZ,'index.html'),encoding='utf-8').read()
            campos=set(re.findall(r'<(?:input|select|textarea)[^>]*\sname="([^"]+)"', html))
            d={k:v for k,v in d.items() if k in campos}
            idv=d.get('invitacion','')
            if idv:
                RESPUESTAS[idv]={'asiste':str(d.get('asiste','')).lower().startswith('s'),
                                 'personas':int(d.get('personas') or 0),
                                 'cuando':'2026-09-02T18:00:00.000Z'}
            b=b'ok'
            self.send_response(200); self.send_header('content-length',str(len(b)))
            self.end_headers(); self.wfile.write(b); return
        self.send_error(404)

    def do_GET(self):
        u=urlparse(self.path)
        if u.path=='/api/invitacion':
            i=(parse_qs(u.query).get('i',[''])[0]).strip().lower()
            inv=DATOS.get(i) if re.fullmatch(r'[a-z0-9-]{1,60}', i or '') else None
            if inv:
                inv=dict(inv)
                if i in CIVIL: inv['civil']=CIVIL[i]
                inv['respuesta']=RESPUESTAS.get(i)
                _r=RECADOS.get(i)
                inv['recado']=({'texto':_r['texto'],'actualizado':_r['actualizado']} if _r else None)
            b=json.dumps(inv or {'error':'no encontrada'}).encode()
            self.send_response(200 if inv else 404)
            self.send_header('content-type','application/json')
            self.send_header('content-length',str(len(b))); self.end_headers(); self.wfile.write(b)
            return
        # imita la Edge Function de la vista previa personalizada
        m = re.fullmatch(r'/([a-z0-9-]{1,60})', u.path)
        if m and m.group(1) in DATOS:
            inv = DATOS[m.group(1)]
            html = open(os.path.join(RAIZ,'index.html'), encoding='utf-8').read()
            def esc(t): return (t.replace('&','&amp;').replace('<','&lt;')
                                 .replace('>','&gt;').replace('"','&quot;'))
            def pon(h, k, v):
                return re.sub(r'(<meta\s+(?:property|name)="'+re.escape(k)+r'"\s+content=")[^"]*(")',
                              lambda mm: mm.group(1)+v+mm.group(2), h, count=1)
            saludo = esc(inv['saludo']); uno = (inv.get('pases') or 1) <= 1
            titulo = f"{saludo}, ¿nos acompañ{'as' if uno else 'an'}?"
            desc = ('Jorge y Montse se casan el 30 de enero de 2027 en Morelia. '
                    'Aquí está todo lo que necesitas saber, y tu confirmación.')
            origen = 'http://127.0.0.1:8766'
            img = f"{origen}/assets/og/{m.group(1)}.jpg"
            for k, v in (('og:title',titulo),('twitter:title',titulo),
                         ('og:description',desc),('twitter:description',desc),
                         ('og:image',img),('og:image:secure_url',img),('twitter:image',img),
                         ('og:image:alt', f"{saludo}: la invitación a la boda de Jorge y Montse"),
                         ('og:url', f"{origen}/{m.group(1)}")):
                html = pon(html, k, v)
            b = html.encode('utf-8')
            self.send_response(200); self.send_header('content-type','text/html; charset=utf-8')
            self.send_header('content-length',str(len(b))); self.end_headers(); self.wfile.write(b)
            return
        if u.path=='/': self.path='/index.html'
        # imita las reescrituras de netlify.toml
        elif u.path=='/panel': self.path='/panel.html'
        elif u.path=='/libro': self.path='/libro.html'
        elif re.fullmatch(r'/(netlify|assets/savethedatepics)/.*', u.path):
            self.send_error(404); return
        elif re.fullmatch(r'/[^/.]+', u.path) and not os.path.exists(self.translate_path(u.path)):
            self.path='/index.html'          # link bonito: /paloma-cambron
        return SimpleHTTPRequestHandler.do_GET(self)
    def log_message(self,*a): pass
ThreadingHTTPServer(('127.0.0.1',8766), H).serve_forever()
