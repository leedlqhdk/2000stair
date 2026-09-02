"""이천 관리지역 인터랙티브 지도용 SVG 생성.

기존 9개 지역 + 호법면을 '하나의 공통 등거리 투영'으로 함께 그려,
모든 지역이 같은 좌표계(viewBox) 위에서 정확히 맞물리도록 한다.

사용:
    python3 make_icheon_map.py /path/to/HangJeongDong_ver20260201.geojson
출력:
    - icheon_map_all.svg  (지역별 <path id="지역명"> 포함)
    - 콘솔에 각 지역 라벨 중심좌표(cx, cy) 출력  → Areas.tsx LABEL_POS 용
"""
import json, math, sys
from pathlib import Path

src = Path(sys.argv[1] if len(sys.argv) > 1 else "HangJeongDong_ver20260201.geojson")
out = src.parent / "icheon_map_all.svg"

# 지도에 표시할 이천 관리지역 (기존 9 + 호법면)
TARGETS = [
    "경기도 이천시 관고동", "경기도 이천시 증포동", "경기도 이천시 중리동", "경기도 이천시 창전동",
    "경기도 이천시 부발읍", "경기도 이천시 신둔면", "경기도 이천시 백사면", "경기도 이천시 마장면",
    "경기도 이천시 대월면", "경기도 이천시 호법면",
]

with src.open(encoding="utf-8") as f:
    data = json.load(f)

feats = {}
for ft in data["features"]:
    nm = ft.get("properties", {}).get("adm_nm")
    if nm in TARGETS:
        feats[nm] = ft
missing = [t for t in TARGETS if t not in feats]
if missing:
    print("경고: GeoJSON에서 못 찾은 지역:", missing)

# 모든 대상 지역의 꼭짓점을 모아 공통 투영 파라미터 계산
def rings_of(ft):
    g = ft["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    return polys

all_pts = [(lon, lat) for ft in feats.values() for poly in rings_of(ft) for ring in poly for lon, lat in ring]
lon0 = sum(p[0] for p in all_pts) / len(all_pts)
lat0 = sum(p[1] for p in all_pts) / len(all_pts)
cos0 = math.cos(math.radians(lat0))
proj = lambda lon, lat: ((lon - lon0) * cos0, -(lat - lat0))
P = [proj(lon, lat) for lon, lat in all_pts]
minx = min(x for x, _ in P); maxx = max(x for x, _ in P)
miny = min(y for _, y in P); maxy = max(y for _, y in P)

TARGET_W = 900.0            # viewBox 폭(임의) — 비율만 중요
scale = TARGET_W / (maxx - minx)
W = TARGET_W
H = (maxy - miny) * scale

def xy(lon, lat):
    px, py = proj(lon, lat)
    return (px - minx) * scale, (py - miny) * scale

def ring_path(ring):
    pts = [xy(lon, lat) for lon, lat in ring]
    return "M " + " L ".join(f"{x:.2f},{y:.2f}" for x, y in pts) + " Z"

paths = []
label_pos = {}
for nm in TARGETS:
    if nm not in feats:
        continue
    short = nm.replace("경기도 이천시 ", "")
    d = " ".join(ring_path(r) for poly in rings_of(feats[nm]) for r in poly)
    paths.append(f'    <path id="{short}" d="{d}" fill="#dbe7fb" stroke="#3155a4" stroke-width="1.2" fill-rule="evenodd"/>')
    # 라벨 중심 = 이 지역 꼭짓점들의 bbox 중심
    pp = [xy(lon, lat) for poly in rings_of(feats[nm]) for r in poly for lon, lat in r]
    cx = (min(x for x, _ in pp) + max(x for x, _ in pp)) / 2
    cy = (min(y for _, y in pp) + max(y for _, y in pp)) / 2
    label_pos[short] = (round(cx, 1), round(cy, 1))

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} {H:.1f}">\n'
    + "\n".join(paths)
    + "\n</svg>\n"
)
out.write_text(svg, encoding="utf-8")

print(f"created {out}  (viewBox 0 0 {W:.1f} {H:.1f}, {len(paths)} regions)")
print("LABEL_POS (cx, cy):")
for k, (cx, cy) in label_pos.items():
    print(f"  {k}: {{ cx: {cx}, cy: {cy} }},")
