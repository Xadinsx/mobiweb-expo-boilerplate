"""Writes four placeholder icon PNGs for a new vendor: a disc on a solid background.

Usage: python3 placeholder-assets.py <assets-dir> <background-hex> <disc-hex>
The files are different for every color pair, which the vendor-isolation check needs.
"""
import struct
import sys
import zlib
from pathlib import Path


def rgba(hex_color, alpha=255):
    value = hex_color.lstrip("#")
    return (int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16), alpha)


def write_png(path, size, background, disc, radius):
    centre, limit = size // 2, (size * radius) ** 2
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            inside = (x - centre) ** 2 + (y - centre) ** 2 <= limit
            row += bytes(disc if inside else background)
        rows.append(bytes(row))

    def chunk(kind, data):
        body = kind + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body))

    header = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(b"".join(rows), 9))
        + chunk(b"IEND", b"")
    )


folder = Path(sys.argv[1])
folder.mkdir(parents=True, exist_ok=True)
background, disc = rgba(sys.argv[2]), rgba(sys.argv[3])
clear = (0, 0, 0, 0)
write_png(folder / "icon.png", 512, background, disc, 0.3)
write_png(folder / "android-icon-foreground.png", 512, clear, disc, 0.22)
write_png(folder / "android-icon-background.png", 512, background, background, 0)
write_png(folder / "android-icon-monochrome.png", 512, clear, (0, 0, 0, 255), 0.22)
