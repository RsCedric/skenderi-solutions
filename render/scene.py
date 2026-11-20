# Skenderi Solutions mark as a real object: the S bent from one titanium bar, two glass nodes with a blue light inside.
# Built from the SVG path of the old mark (M84 30 H50 a15 15 0 0 0 0 30 H70 a15 15 0 0 1 0 30 H36), 1 unit = 1 mm.
#
#   blender -b -P render/scene.py -- --mode test           hero framing, half size, few samples
#   blender -b -P render/scene.py -- --mode hero           2400x1500 hero still (dark studio)
#   blender -b -P render/scene.py -- --mode icon           1024x1024 square tile for nav logo and favicon
#   options: --samples N --out DIR
import bpy, bmesh, math, os, sys
from mathutils import Vector

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
def arg(name, default=None):
    return ARGS[ARGS.index(name) + 1] if name in ARGS else default

MODE = arg("--mode", "test")
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(arg("--out", os.path.join(HERE, "out")))
ASSETS = os.path.abspath(arg("--assets", os.path.join(HERE, "assets")))
ICON = MODE.startswith("icon")

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
MM = 0.001

def principled(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    return m, m.node_tree, m.node_tree.nodes["Principled BSDF"]

def titanium():
    m, nt, p = principled("Titan")
    p.inputs["Base Color"].default_value = (0.56, 0.57, 0.60, 1)
    p.inputs["Metallic"].default_value = 1.0
    p.inputs["Anisotropic"].default_value = 0.55
    tc = nt.nodes.new("ShaderNodeTexCoord")
    # brushed grain: noise stretched along x, drives roughness and a fine bump
    mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (40, 2600, 2600)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    n = nt.nodes.new("ShaderNodeTexNoise"); n.inputs["Scale"].default_value = 1.0; n.inputs["Detail"].default_value = 12
    nt.links.new(mp.outputs["Vector"], n.inputs["Vector"])
    mr = nt.nodes.new("ShaderNodeMapRange"); mr.inputs["To Min"].default_value = 0.16; mr.inputs["To Max"].default_value = 0.3
    nt.links.new(n.outputs["Fac"], mr.inputs["Value"]); nt.links.new(mr.outputs["Result"], p.inputs["Roughness"])
    b = nt.nodes.new("ShaderNodeBump"); b.inputs["Strength"].default_value = 0.18; b.inputs["Distance"].default_value = 0.00003
    nt.links.new(n.outputs["Fac"], b.inputs["Height"]); nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    return m

def glass():
    m, nt, p = principled("Glas")
    p.inputs["Base Color"].default_value = (0.7, 0.82, 1.0, 1)
    p.inputs["Transmission Weight"].default_value = 1.0
    p.inputs["IOR"].default_value = 1.5
    p.inputs["Roughness"].default_value = 0.04
    return m

def emitter():
    m, nt, p = principled("Licht")
    p.inputs["Base Color"].default_value = (0.02, 0.06, 0.2, 1)
    p.inputs["Emission Color"].default_value = (0.04, 0.22, 1.0, 1)
    p.inputs["Emission Strength"].default_value = float(arg("--glow", "5"))
    return m

def backdrop_mat():
    m, nt, p = principled("Hintergrund")
    p.inputs["Base Color"].default_value = (0.0025, 0.0035, 0.007, 1)
    p.inputs["Roughness"].default_value = 0.25
    p.inputs["Specular IOR Level"].default_value = 0.12
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n = nt.nodes.new("ShaderNodeTexNoise"); n.inputs["Scale"].default_value = 60; n.inputs["Detail"].default_value = 8
    mr = nt.nodes.new("ShaderNodeMapRange"); mr.inputs["To Min"].default_value = 0.16; mr.inputs["To Max"].default_value = 0.3
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"]); nt.links.new(n.outputs["Fac"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], p.inputs["Roughness"])
    return m

def link(o):
    sc.collection.objects.link(o); return o

# --- the S: path sampled from the SVG, swept with a rounded-rectangle profile -------------------
def s_points():
    pts = []
    def line(a, b, n=2):
        for i in range(n): pts.append((a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n))
    def arc(cx, cy, r, a0, a1, n=40):
        for i in range(n):
            a = a0 + (a1 - a0) * i / n
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    line((84, 30), (50, 30), 6)
    arc(50, 45, 15, -math.pi / 2, -3 * math.pi / 2)      # around the left, top to bottom
    line((50, 60), (70, 60), 4)
    arc(70, 75, 15, -math.pi / 2, math.pi / 2)            # around the right
    line((70, 90), (36, 90), 6)
    pts.append((36, 90))
    return pts

W, D, R = 8.0, 13.0, 2.6      # bar width in the drawing plane, depth, corner radius (mm)
def profile():
    cu = bpy.data.curves.new("Profil", "CURVE"); cu.dimensions = "2D"
    sp = cu.splines.new("POLY"); pts = []
    hw, hd = W / 2 * MM, D / 2 * MM; r = R * MM
    for cx, cy, a0 in ((hw - r, hd - r, 0), (-hw + r, hd - r, 90), (-hw + r, -hd + r, 180), (hw - r, -hd + r, 270)):
        for i in range(7):
            a = math.radians(a0 + 90 * i / 6); pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    sp.points.add(len(pts) - 1)
    for p, (x, y) in zip(sp.points, pts): p.co = (x, y, 0, 1)
    sp.use_cyclic_u = True
    o = link(bpy.data.objects.new("Profil", cu)); o.hide_render = True; o.hide_viewport = True
    return o

BOTTOM = 95.5   # lowest point (bottom of the lower node), sits on the floor
def to_world(x, y):
    # drawing plane = XZ, standing upright, centred on x = 60
    return Vector(((x - 60) * MM, 0, (BOTTOM - y) * MM))

def build_mark(tilt_deg=0.0):
    root = link(bpy.data.objects.new("Zeichen", None))
    cu = bpy.data.curves.new("S", "CURVE"); cu.dimensions = "3D"; cu.twist_mode = "MINIMUM"
    cu.bevel_mode = "OBJECT"; cu.bevel_object = profile(); cu.use_fill_caps = True
    sp = cu.splines.new("POLY"); pts = s_points(); sp.points.add(len(pts) - 1)
    for p, (x, y) in zip(sp.points, pts):
        v = to_world(x, y); p.co = (v.x, v.y, v.z, 1)
    s = link(bpy.data.objects.new("S", cu)); s.data.materials.append(titanium()); s.parent = root
    # turn the curve into a mesh so edges can get a real bevel and smooth shading
    bpy.context.view_layer.objects.active = s; s.select_set(True)
    bpy.ops.object.convert(target="MESH")
    s = bpy.context.active_object
    for poly in s.data.polygons: poly.use_smooth = True
    bv = s.modifiers.new("Kante", "BEVEL"); bv.width = 0.35 * MM; bv.segments = 3; bv.limit_method = "ANGLE"
    s.modifiers.new("Glatt", "WEIGHTED_NORMAL").keep_sharp = False

    g, e = glass(), emitter()
    for (x, y) in ((88.5, 30), (31.5, 90)):
        c = to_world(x, y)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=5.6 * MM, location=c)
        o = bpy.context.active_object; o.data.materials.append(g); o.parent = root
        for poly in o.data.polygons: poly.use_smooth = True
        bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=2.6 * MM, location=c)
        o = bpy.context.active_object; o.data.materials.append(e); o.parent = root
        for poly in o.data.polygons: poly.use_smooth = True
        # a small light so the glow also lands on the titanium and the floor
        l = bpy.data.lights.new("Knoten", "POINT"); l.energy = float(arg("--node-light", "1.6")); l.color = (0.3, 0.55, 1.0)
        l.shadow_soft_size = 0.002
        lo = link(bpy.data.objects.new("Knoten", l)); lo.location = c; lo.parent = root
    root.rotation_euler = (0, 0, math.radians(tilt_deg))
    return root

def build_backdrop():
    # a large dark floor only; the room behind it is the dark world, so the subject sits in falling light
    bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 0, 0))
    o = bpy.context.active_object; o.name = "Boden"; o.data.materials.append(backdrop_mat())
    return o

def area(name, pos, target, size, energy, color=(1, 1, 1)):
    l = bpy.data.lights.new(name, "AREA"); l.size, l.size_y = size; l.shape = "RECTANGLE"; l.energy = energy; l.color = color
    o = link(bpy.data.objects.new(name, l)); o.location = pos
    o.rotation_euler = (Vector(target) - Vector(pos)).to_track_quat("-Z", "Y").to_euler(); return o

# --- scene -------------------------------------------------------------------------------------
mark = build_mark(float(arg("--turn", "-18" if ICON else "-24")))
build_backdrop()

world = bpy.data.worlds.new("Welt"); sc.world = world; world.use_nodes = True
wn, wl = world.node_tree.nodes, world.node_tree.links
bg = wn["Background"]; bg.inputs["Strength"].default_value = float(arg("--world", "0.012"))
hdr = os.path.join(ASSETS, "hdri", "studio_small_09.hdr")
if os.path.exists(hdr):
    env = wn.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load(hdr)
    wl.new(env.outputs["Color"], bg.inputs["Color"])
# the camera and diffuse light see a deep navy room, only glossy rays see the studio HDRI
dark = wn.new("ShaderNodeBackground"); dark.inputs["Color"].default_value = (0.004, 0.007, 0.016, 1); dark.inputs["Strength"].default_value = 1
lp = wn.new("ShaderNodeLightPath"); mix = wn.new("ShaderNodeMixShader")
wl.new(lp.outputs["Is Camera Ray"], mix.inputs[0]); wl.new(bg.outputs[0], mix.inputs[1]); wl.new(dark.outputs[0], mix.inputs[2])
wl.new(mix.outputs[0], wn["World Output"].inputs["Surface"])

C = Vector((0, 0, 0.034))
# a long strip softbox overhead-left draws the bright line along the bar, a cool rim separates it from the dark
area("Key", (-0.24, 0.06, 0.4), C, (0.5, 0.12), 30, (1.0, 0.97, 0.92))
area("Spiegel", (0.05, -0.4, 0.4), C, (0.7, 0.14), 10, (0.95, 0.97, 1.0))
only = bpy.data.collections.new("NurZeichen")
for o in [mark] + list(mark.children_recursive): only.objects.link(o)
def mark_only(light):
    # light linking: this light shades the mark, not the floor
    light.light_linking.receiver_collection = only; return light
mark_only(area("Fill", (0.36, -0.3, 0.08), C, (0.3, 0.3), 3.5, (0.8, 0.88, 1.0)))
mark_only(area("Rim", (0.16, 0.32, 0.16), C, (0.05, 0.4), 22, (0.75, 0.85, 1.0)))
mark_only(area("Kante", (-0.26, 0.26, 0.1), C, (0.05, 0.35), 9, (0.85, 0.9, 1.0)))

cam_data = bpy.data.cameras.new("Kamera"); cam = link(bpy.data.objects.new("Kamera", cam_data)); sc.camera = cam
cam_data.sensor_width = 36
aim = link(bpy.data.objects.new("Ziel", None)); aim.location = C
tr = cam.constraints.new("TRACK_TO"); tr.target = aim; tr.track_axis = "TRACK_NEGATIVE_Z"; tr.up_axis = "UP_Y"
cam_data.dof.use_dof = True; cam_data.dof.focus_object = aim; cam_data.dof.aperture_blades = 7

if ICON:
    cam_data.lens = 100; cam_data.dof.aperture_fstop = 5.6
    cam.location = C + Vector((0.024, -0.37, 0.06))
    aim.location = C + Vector((0.004, 0, -0.002))
    W_, H_ = 1024, 1024
else:
    cam_data.lens = float(arg("--lens", "85")); cam_data.dof.aperture_fstop = float(arg("--fstop", "4"))
    cam.location = C + Vector((0.05, -0.56, 0.11))
    cam_data.shift_x = float(arg("--shift", "-0.2"))
    W_, H_ = 2400, 1500

sc.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
for kind in ("OPTIX", "CUDA", "HIP", "METAL", "ONEAPI"):
    try:
        prefs.compute_device_type = kind; prefs.get_devices()
        if not any(d.type == kind for d in prefs.devices): continue
        for d in prefs.devices: d.use = d.type == kind
        sc.cycles.device = "GPU"; print("GPU:", kind); break
    except Exception:
        continue
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 12; sc.cycles.transmission_bounces = 12; sc.cycles.glossy_bounces = 8
sc.view_settings.view_transform = "AgX"
try: sc.view_settings.look = "AgX - Medium High Contrast"
except Exception: pass
sc.view_settings.exposure = float(arg("--exposure", "0"))
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGB"
sc.render.resolution_x, sc.render.resolution_y = W_, H_
sc.render.resolution_percentage = 50 if MODE in ("test", "icon-test") else 100
sc.cycles.samples = int(arg("--samples", "64" if "test" in MODE else "512"))
os.makedirs(OUT, exist_ok=True)
sc.render.filepath = os.path.join(OUT, {"test": "test.png", "hero": "hero.png", "icon": "icon.png", "icon-test": "icon-test.png"}[MODE])
bpy.ops.render.render(write_still=True)
