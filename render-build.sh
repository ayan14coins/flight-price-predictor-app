#!/usr/bin/env bash
# Install backend deps
pip install -r requirements.txt

# Install frontend deps & build
npm install
npm run build
