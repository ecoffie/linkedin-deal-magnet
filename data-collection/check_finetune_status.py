#!/usr/bin/env python3
"""
Check fine-tuning job status
"""
import os
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

client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

# Read job ID
job_file = Path(__file__).parent / 'finetune_job.txt'
job_id = None
if job_file.exists():
    with open(job_file) as f:
        for line in f:
            if line.startswith('job_id='):
                job_id = line.split('=')[1].strip()
                break

if not job_id:
    print("No job ID found. Run submit_finetune.py first.")
    exit(1)

print(f"Checking job: {job_id}\n")

job = client.fine_tuning.jobs.retrieve(job_id)

print(f"Status: {job.status}")
print(f"Model: {job.model}")

if job.fine_tuned_model:
    print(f"\n✅ FINE-TUNED MODEL READY!")
    print(f"Model ID: {job.fine_tuned_model}")
    print(f"\nAdd this to your .env file:")
    print(f"FINE_TUNED_MODEL={job.fine_tuned_model}")

if job.status == "failed":
    print(f"\n❌ Job failed!")
    if job.error:
        print(f"Error: {job.error}")

if job.status in ["validating_files", "queued", "running"]:
    print(f"\n⏳ Job is still processing...")
    print("Run this script again in a few minutes.")

# Show events
print("\nRecent events:")
events = client.fine_tuning.jobs.list_events(job_id, limit=5)
for event in events.data:
    print(f"  - {event.message}")
