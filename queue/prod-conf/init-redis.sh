#!/bin/bash

# Grant temporary write access (use with caution)
chmod +w /etc/sysctl.conf

echo 'vm.overcommit_memory=1' >> /etc/sysctl.conf
sysctl -p

# Revert write access (optional)
chmod -w /etc/sysctl.conf
