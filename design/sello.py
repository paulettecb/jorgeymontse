# -*- coding: utf-8 -*-
"""Genera assets/sello-{vino,dorado,verde}.svg, el lacre de la portada.

    python3 design/sello.py assets

Nada de esto está dibujado a mano: el borde irregular sale de un círculo
al que se le mueve el radio con dos ondas y un poco de azar (charco()), y el
relieve lo calcula el navegador. El grupo que se dibuja es un mapa de alturas
en gris —charco bajo, anillo alto, monograma más alto— y el filtro lo pasa por
feDiffuseLighting/feSpecularLighting con una luz que entra por arriba a la
izquierda. Por eso el monograma se ve hundido en la cera en vez de impreso
encima, que era el problema del sello anterior.

El color va dentro del filtro (feFlood), así que no se puede recolorear desde
CSS: por eso son tres archivos y no uno. site.js elige cuál según CONFIG.sealColor.
"""
import math, random, io, os, sys

def catmull(pts):
    n = len(pts)
    d = "M%.1f,%.1f" % pts[0]
    for i in range(n):
        p0, p1, p2, p3 = pts[(i-1)%n], pts[i], pts[(i+1)%n], pts[(i+2)%n]
        c1 = (p1[0]+(p2[0]-p0[0])/6.0, p1[1]+(p2[1]-p0[1])/6.0)
        c2 = (p2[0]-(p3[0]-p1[0])/6.0, p2[1]-(p3[1]-p1[1])/6.0)
        d += "C%.1f,%.1f %.1f,%.1f %.1f,%.1f" % (c1+c2+p2)
    return d+"Z"

def charco(seed, n, base, amp, lob, lobamp, ovalo=1.8):
    """Un charco de cera no es un engrane: las ondas del borde no son todas
       del mismo tamaño. La amplitud del festón se modula con una onda lenta,
       así unas ondas salen pronunciadas y otras casi planas."""
    r = random.Random(seed); f1 = r.random()*6.283; f2 = r.random()*6.283; pts=[]
    for i in range(n):
        a = 2*math.pi*i/n
        mod = 0.30 + 0.70*abs(math.sin(a*1.15 + f2))
        rad = (base
               + amp*mod*math.sin(a*lob + f1)
               + lobamp*r.uniform(-1, 1)
               + ovalo*math.sin(a*2 + f2)
               + ovalo*0.6*math.sin(a*3 + f1*1.7))
        pts.append((100+rad*math.cos(a), 100+rad*math.sin(a)))
    return catmull(pts)

CHARCO = charco(23, 46, 86, 5.2, 11, 1.6, 2.4)
ANILLO = charco(5, 30, 72, 0.7, 9, 0.8, 0.9)
CAMPO  = charco(5, 30, 65, 0.6, 9, 0.7, 0.8)

MONO = ('<g transform="translate(100.6,99.3) scale(.0372)">'
        '<g transform="translate(-1120,737) scale(1,-1)">'
        '<path d="M539 503C539 118 300 0 10 0V105C143 105 171 269 171 503V1381C171 1409 132 1428 132 1428V1434H577V1428C577 1428 539 1409 539 1381Z"/>'
        '<path d="M791 718 1135 1434H1542V1428C1542 1428 1503 1409 1503 1381V53C1503 25 1542 6 1542 6V0H1096V6C1096 6 1135 25 1135 53C1135 53 1135 1215 1135 1215L660 225L185 1213C185 411 447 43 447 43V0H40V6C40 6 79 25 79 53V1381C79 1409 40 1428 40 1428V1434H447Z" transform="translate(658,0)"/>'
        '</g></g>')

# niveles del mapa de alturas (gris = altura)
NIV = dict(charco='#5E5E5E', anillo='#DCDCDC', campo='#8F8F8F', mono='#F4F4F4')

CERAS = {
    'vino':   '#6E1D2E',
    'dorado': '#A8823A',
    'verde':  '#54634A',
}

TPL = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Sello de lacre con el monograma J&amp;M">
<defs>
<!-- El relieve no está dibujado: se calcula. El grupo de abajo es un mapa de
     alturas en gris (charco bajo, anillo alto, monograma más alto) y el filtro
     lo convierte en superficie iluminada, así el monograma se ve hundido en la
     cera en lugar de impreso encima. -->
<filter id="cera" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
<feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="alturas"/>
<feGaussianBlur in="alturas" stdDeviation="{blur}" result="suave"/>
<feTurbulence type="fractalNoise" baseFrequency="{grano}" numOctaves="4" seed="9" result="ruido"/>
<feColorMatrix in="ruido" type="luminanceToAlpha" result="ruidoA"/>
<feComposite in="ruidoA" in2="suave" operator="arithmetic" k1="0" k2="{granoK}" k3="1" k4="0" result="relieve"/>
<feDiffuseLighting in="relieve" surfaceScale="{escala}" diffuseConstant="{kd}" lighting-color="#ffffff" result="difusa">
<feDistantLight azimuth="{az}" elevation="{el}"/>
</feDiffuseLighting>
<feSpecularLighting in="relieve" surfaceScale="{escala}" specularConstant="{ks}" specularExponent="{exp}" lighting-color="#fff8ec" result="brillo">
<feDistantLight azimuth="{az}" elevation="{el}"/>
</feSpecularLighting>
<feFlood flood-color="{cera}" result="tinta"/>
<feComposite in="tinta" in2="difusa" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="conLuz"/>
<feComposite in="brillo" in2="SourceAlpha" operator="in" result="brilloRec"/>
<feComposite in="conLuz" in2="brilloRec" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lacre"/>
<feComposite in="lacre" in2="SourceAlpha" operator="in"/>
</filter>
</defs>
<g filter="url(#cera)">
<path d="{charco}" fill="{n_charco}"/>
<path d="{anillo}" fill="{n_anillo}"/>
<path d="{campo}" fill="{n_campo}"/>
{mono_h}
</g>
</svg>
'''

def build(cera):
    el = 42.0
    return TPL.format(
        blur=1.15, grano='0.62 0.58', granoK=0.085, escala=6.2,
        kd=round(1.0/math.sin(math.radians(el)), 3), az=232, el=el,
        ks=0.46, exp=24, cera=cera,
        charco=CHARCO, anillo=ANILLO, campo=CAMPO,
        n_charco=NIV['charco'], n_anillo=NIV['anillo'], n_campo=NIV['campo'],
        mono_h=MONO.replace('<g transform="translate(100.8', '<g fill="%s" transform="translate(100.8' % NIV['mono'], 1),
    )

dest = sys.argv[1] if len(sys.argv) > 1 else '.'
for nombre, color in CERAS.items():
    p = os.path.join(dest, 'sello-%s.svg' % nombre)
    with io.open(p, 'w', encoding='utf-8') as f:
        f.write(build(color))
    print(p, os.path.getsize(p))
