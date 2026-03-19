#!/usr/bin/env python3
"""
Submit fine-tuning job to OpenAI for GovCon LinkedIn content generation
"""
import os
import sys
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key] = value

from openai import OpenAI

# Initialize client
client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

TRAINING_FILE = Path(__file__).parent / 'combined_finetune_clean.jsonl'

def main():
    print("=" * 50)
    print("GovCon LinkedIn Fine-Tuning Job Submission")
    print("=" * 50)

    # Step 1: Upload training file
    print("\n1. Uploading training file...")
    try:
        with open(TRAINING_FILE, 'rb') as f:
            file_response = client.files.create(
                file=f,
                purpose='fine-tune'
            )
        print(f"   ✓ File uploaded: {file_response.id}")
        print(f"   ✓ Filename: {file_response.filename}")
        print(f"   ✓ Size: {file_response.bytes} bytes")
    except Exception as e:
        print(f"   ✗ Error uploading file: {e}")
        sys.exit(1)

    # Step 2: Create fine-tuning job
    print("\n2. Creating fine-tuning job...")
    try:
        job_response = client.fine_tuning.jobs.create(
            training_file=file_response.id,
            model="gpt-4o-mini-2024-07-18",
            suffix="govcon-linkedin",
            hyperparameters={
                "n_epochs": 3
            }
        )
        print(f"   ✓ Job created: {job_response.id}")
        print(f"   ✓ Status: {job_response.status}")
        print(f"   ✓ Model: {job_response.model}")

        # Save job ID for later reference
        job_file = Path(__file__).parent / 'finetune_job.txt'
        with open(job_file, 'w') as f:
            f.write(f"job_id={job_response.id}\n")
            f.write(f"file_id={file_response.id}\n")
            f.write(f"status={job_response.status}\n")
            f.write(f"model={job_response.model}\n")

        print(f"\n   Job ID saved to: {job_file}")

    except Exception as e:
        print(f"   ✗ Error creating job: {e}")
        sys.exit(1)

    print("\n" + "=" * 50)
    print("SUCCESS! Fine-tuning job submitted.")
    print("=" * 50)
    print(f"\nJob ID: {job_response.id}")
    print("\nNext steps:")
    print("  1. Monitor job: python3 check_finetune_status.py")
    print("  2. Once complete, update FINE_TUNED_MODEL in server.js")
    print("\nEstimated time: 15-30 minutes for 146 examples")

if __name__ == '__main__':
    main()
