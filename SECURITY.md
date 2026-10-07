# Security Policy

## Supported versions

Only the latest release on the
[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=soohumkaushik.vscode-widget-dashboard)
receives security fixes.

## Reporting a vulnerability

**Please don't open a public issue for security problems.**

Report vulnerabilities privately through
[GitHub's private vulnerability reporting](https://github.com/SoohumKaushik/vscode-widget-dashboard/security/advisories/new).
Include:

- what the issue is and what an attacker could do with it
- steps to reproduce, or a proof of concept
- the extension and VS Code versions you tested

You should get an acknowledgement within a few days. Once a fix is released,
the advisory will be published with credit to you unless you'd rather stay
anonymous.

## Scope

Areas of particular interest:

- the GitHub access token, which must never leave the extension host
- the webview's Content Security Policy and message handling
- data fetched from third-party APIs (Yahoo Finance, ESPN, GitHub, Mixkit) and
  how it's rendered
