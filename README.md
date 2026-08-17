# ML Systems Atlas

A private, dependency-free static study application for learning reusable ML system-design foundations and applying them to end-to-end problems. The root learning order is Start Here → Foundations → ML Tasks → Applied Systems → Study.

## Run locally

From this directory:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

No build step or network connection is required. Progress is stored only in the browser's local storage.

## Included in this iteration

- Seven foundation categories placed immediately after Start Here
- A separate root-level ML Tasks section with atomic task guides
- Four applied system walkthroughs
- Interactive binary cross-entropy lab
- Interactive embedding/tensor-shape explorer
- Interactive activation and local-gradient explorer
- Architecture comparison tool
- Formula atlas covering linear models, GBDT, DNN, DCN, CNN, RNN, transformers, and two-tower models
- Task-aware metric routing map
- Collaborative filtering, content-based filtering, matrix factorization, implicit ALS, BPR, and hybrid retrieval
- Pointwise, pairwise, and listwise LTR; RankNet, ListMLE, LambdaRank, and LambdaMART
- Worked numerical examples for embedding lookup, vector similarity, matrix factorization, DNN/DCN forward computation, and NDCG
- Objective and gradient/subgradient plots for every atomic loss, with domain, differentiability, convexity conditions, and parameterization caveats
- Worked-example visuals for all fifteen architectures: fitted lines, decision boundaries, matrix factorization, feature partitions, additive boosting, LambdaMART swaps, tensor computations, kernels, sequence state, attention matrices, vector geometry, and expert mixtures
- Expert review lenses for every architecture covering inductive bias, training geometry, serving shape, and characteristic failure modes
- Atomic concept pages organized as concept → formula → worked example → chart when appropriate
- Dedicated symbol legends beneath atomic concept, task, and architecture formulas, with conceptual interpretation kept separate
- Expanded Wide & Deep, DCN/DCNv2, and Transformer diagrams with multi-step numerical forward passes
- Full applied-system capstones with training rows, encoded feature examples, stage-by-stage model alternatives, explicit tradeoffs, worked calculations, layered metrics, serving design, and mitigations
- Vertically stacked fraction notation across canonical and overview equations
- Model-level architecture diagrams for every applied system, distinct from stage-flow diagrams
- Production-system architecture for every applied example: online serving path, offline training/deployment loop, feature stores, event infrastructure, registries, caches/indexes, experimentation, monitoring, and failure fallbacks
- Fourteen task guides—thirteen catalog tasks plus Learning to Rank—connecting input/output contracts, functions, losses, metrics, architectures, and systems
- Fifteen atomic architecture pages with component maps, computation diagrams, formulas, worked forward passes, and compatible tasks
- Separate pages for sigmoid, ReLU, tanh, softmax, GELU, BCE, categorical cross-entropy, MSE, MAE, Huber, focal, contrastive, RankNet, and core metrics
- System-specific cumulative learning paths for ad CTR, next-video recommendation, visual search, and content safety
- Persistent learning-path completion, next-step guidance, and return-to-path context
- Image, video, audio, and multimodal feature-engineering pipelines
- Active-recall formula study deck
- Search, completion tracking, and interview prompts

## Audit status

The included `scripts/audit.mjs` performs structural, relationship, rendering, fraction-layout, and worked-arithmetic checks across the complete route graph. See `AUDIT.md` for the latest audit scope and corrections.

The educational content is original and organized as a private study atlas. It is not a reproduction of any book.
