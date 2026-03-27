#!/usr/bin/env python3
"""
Mask the left and right quarters of an MP4 with black bars.

Example:
    python assets/projects/mask_video_sides.py \
        --input assets/projects/aura/teaser.mp4 \
        --output assets/projects/aura/teaser_masked.mp4
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Apply black masks to the left 1/4 and right 1/4 of a video, "
            "then export as MP4."
        )
    )
    parser.add_argument(
        "--input",
        "-i",
        required=True,
        help="Path to input MP4 file.",
    )
    parser.add_argument(
        "--output",
        "-o",
        required=True,
        help="Path to output MP4 file.",
    )
    parser.add_argument(
        "--crf",
        type=int,
        default=18,
        help="Video quality for H.264 encoding (lower is higher quality). Default: 18.",
    )
    parser.add_argument(
        "--preset",
        default="medium",
        help="H.264 preset for speed/compression tradeoff. Default: medium.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite output file if it exists.",
    )
    return parser.parse_args()


def run_ffmpeg(input_path: Path, output_path: Path, crf: int, preset: str, overwrite: bool) -> None:
    vf = (
        # "drawbox=x=0:y=ih/40:w=iw:h=ih/30:color=white:t=fill,"
        # "drawbox=x=0:y=11*ih/48:w=12*iw/40:h=ih:color=black:t=fill,"
        # "drawbox=x=28*iw/40:y=7*ih/24:w=iw/3:h=ih:color=black:t=fill"
        "drawbox=x=iw/10:y=ih/50:w=iw:h=ih/50:color=white:t=fill,"
        "drawbox=x=iw/37:y=5*ih/48:w=23*iw/80:h=83*ih/160:color=black:t=fill,"
        "drawbox=x=57*iw/80:y=17*ih/96:w=iw/3:h=72*ih/160:color=black:t=fill"
    )

    command = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-y" if overwrite else "-n",
        "-i",
        str(input_path),
        "-vf",
        vf,
        "-c:v",
        "libx264",
        "-crf",
        str(crf),
        "-preset",
        preset,
        "-c:a",
        "copy",
        str(output_path),
    ]

    try:
        subprocess.run(command, check=True)
    except subprocess.CalledProcessError as exc:
        raise RuntimeError("ffmpeg failed while processing the video.") from exc


def main() -> int:
    args = parse_args()

    if shutil.which("ffmpeg") is None:
        print("Error: ffmpeg is not installed or not in PATH.", file=sys.stderr)
        return 1

    input_path = Path(args.input).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()

    if not input_path.exists():
        print(f"Error: input file does not exist: {input_path}", file=sys.stderr)
        return 1

    if input_path.suffix.lower() != ".mp4":
        print(f"Error: input must be an MP4 file: {input_path}", file=sys.stderr)
        return 1

    if output_path.suffix.lower() != ".mp4":
        print(f"Error: output must be an MP4 file: {output_path}", file=sys.stderr)
        return 1

    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        run_ffmpeg(
            input_path=input_path,
            output_path=output_path,
            crf=args.crf,
            preset=args.preset,
            overwrite=args.overwrite,
        )
    except RuntimeError as err:
        print(f"Error: {err}", file=sys.stderr)
        return 1

    print(f"Done: masked video exported to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
