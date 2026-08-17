# ML Systems Atlas — audit record

Audit date: 2026-08-15

## Scope

The full static application was checked across:

- 28 atomic concepts: 5 activations, 8 losses, and 15 metrics
- 14 task guides: 13 catalog tasks plus Learning to Rank
- 15 model architectures
- 4 applied ML systems
- all foundation, comparison, serving, study, and start-here routes

The automated audit validates route reachability, link resolution, formula legends, task–architecture reciprocity, loss diagnostics, architecture diagrams, worked-example visuals, system-section completeness, renderer output, stacked fractions, key arithmetic, local asset references, and CSS brace balance.

Run it with:

```bash
node scripts/audit.mjs
```

## Substantive corrections in this audit

- Separated task output contracts from evaluation formulas for anomaly detection, object detection, and segmentation.
- Added Utility Scoring as an explicit task and Dice as an atomic segmentation metric.
- Corrected ROC-AUC tie handling and distinguished average precision from generic PR-curve area conventions.
- Added zero-denominator and convention caveats for precision, recall, Recall@K, NDCG, R², IoU, Dice, and silhouette score.
- Normalized MMoE gates with softmax and distinguished original DCN from the matrix cross layer in DCNv2.
- Corrected the cross-encoder sequence to include the pooled `[CLS]` token.
- Corrected a CNN kernel calculation and a matrix-factorization worked matrix value.
- Tightened calibration claims, optimizer/weight-decay distinctions, conversion-selection bias, ANN filtering tradeoffs, and cost-threshold assumptions.
- Added softmax behavior visualization and objective plus derivative/subgradient plots for every loss.
- Reconciled task-to-architecture links in both directions and exposed the recommender comparison through navigation.

## Interpretation boundary

Passing the audit means the application passed the checks above; it is not a claim that a compact educational reference is exhaustive or incapable of future correction. Numerical scale, latency, feature dimensions, and system volumes are explicitly illustrative. Architecture and optimization claims state the variable or assumptions under which they apply.

## Primary references used for targeted verification

- DCN-V2: https://arxiv.org/abs/2008.13535
- Focal Loss: https://arxiv.org/abs/1708.02002
- LambdaRank analysis: https://www.microsoft.com/en-us/research/publication/on-the-optimality-of-lambdarank/
