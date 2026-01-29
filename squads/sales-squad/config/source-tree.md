# Source Tree - Sales Squad

## Directory Structure

```
squads/sales-squad/
├── squad.yaml                  # Squad manifest
├── README.md                   # Squad documentation
├── config/                     # Configuration files
│   ├── coding-standards.md    # Code standards
│   ├── tech-stack.md          # Technology stack
│   └── source-tree.md         # This file
├── agents/                     # Agent definitions
│   ├── product-manager.md
│   ├── sales-agent.md
│   └── payment-processor.md
├── tasks/                      # Task implementations
│   ├── product-manager-*.md
│   ├── sales-agent-*.md
│   └── payment-processor-*.md
├── workflows/                  # Multi-step workflows
├── checklists/                 # Validation checklists
├── templates/                  # Document templates
├── tools/                      # Custom tools
├── scripts/                    # Utility scripts
└── data/                       # Static data files
```

## Key Files

| File          | Purpose                                |
| ------------- | -------------------------------------- |
| `squad.yaml`  | Defines squad structure and components |
| `README.md`   | Squad overview and usage guide         |
| `agents/*.md` | Agent role definitions                 |
| `tasks/*.md`  | Task implementations                   |
| `config/*.md` | Configuration and standards            |

## Development Workflow

1. **Agent Development** → `agents/*.md`
2. **Task Implementation** → `tasks/*.md`
3. **Workflow Orchestration** → `workflows/*.md`
4. **Testing & Validation** → `checklists/*.md`
5. **Documentation** → `README.md` and task docs
