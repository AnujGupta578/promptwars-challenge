# Gemini-Powered Universal Bridge Application

This document outlines the detailed plan to develop an application that acts as a universal bridge, converting unstructured, real-world inputs into structured, verified, life-saving actions.

## Goal Description

The goal is to build a highly responsive and accessible web application using Next.js and React.js. The system will leverage a **multi-agent architecture** powered by Gemini to process diverse, chaotic data (e.g., voice, text, images, medical history) and systematically convert it into organized, verifiable, and actionable outputs. The project will strictly adhere to best practices in Code Quality, Security, Efficiency, Testing, Accessibility, and the robust usage of Google Services.

## Multi-Agent Architecture

The core of the system relies on specialized AI agents working sequentially and concurrently. 

1. **Orchestrator Agent**: 
   - Receives the raw input payload (voice, text, image, file).
   - Identifies the modalities present and intent.
   - Routes pieces of the input to the appropriate modality-specific agents.
2. **Modality Agents**:
   - **Vision Agent**: Processes visual data (OCR, image classification, recognizing hazards in photos) using Gemini Pro Vision.
   - **Audio/Speech Agent**: Transcribes and extracts intent/urgency from voice inputs.
   - **Data Extraction Agent**: Parses unstructured text (news excerpts, raw medical history) into structured JSON formats.
3. **Synthesis & Verification Agent**:
   - Aggregates the findings from the Modality Agents.
   - Cross-references data logically (e.g., correlating a photo of a symptom with transcribed medical history).
   - Verifies the feasibility of action using external tools (e.g., Google Maps API for distance in emergencies).
4. **Action Planner Agent**:
   - Compiles the synthesized data into step-by-step, actionable, and life-saving instructions.
   - Formats the output for the strictly-typed Next.js frontend UI.

## Engineering Principles & Integration

1. **Code Quality**:
   - Enforce pure functional components in React.
   - Use TypeScript for strict type-checking across frontend and backend agents.
   - Configure ESLint, Prettier, and Husky for pre-commit hooks.
2. **Security**:
   - Strict Input Validation using `Zod` schemas for all API payloads.
   - Data masking for sensitive information (like Medical History - HIPAA compliance considerations).
   - CSRF and XSS protections built into the Next.js framework.
3. **Efficiency**:
   - Utilize React Server Components (RSC) to keep heavy processing on the server.
   - Implement caching strategies (Next.js Data Cache) for non-urgent repeated requests (like weather/news).
   - Use streaming responses from LLMs to provide instant iterative feedback to the user interface.
4. **Testing**:
   - Unit Testing: Jest and React Testing Library for component isolation.
   - Integration Testing: API route testing mocking the agent pipelines.
   - E2E Testing: Playwright for full user workflow simulations.
5. **Accessibility (a11y)**:
   - Full ARIA suite integration, semantic HTML5 structure.
   - Focus management and keyboard navigability, critical for emergency-use interfaces.
   - WCAG 2.1 AA compliance (high contrast colors, readable fonts).
6. **Google Services Integration**:
   - **Gemini 1.5 Pro / Flash**: Core reasoning engines for the agents.
   - **Google Cloud Speech-to-Text**: High reliability fallbacks for audio processing.
   - **Google Maps Platform**: Location services for real-world contextualization (traffic, proximity).
   - **Firebase/Google Cloud**: For efficient state persistence or serverless deployments.

## Proposed Steps

### Phase 1: Project Initialization & Environment Setup
- Initialize a Next.js App Router project with TypeScript and ESLint.
- Configure TailwindCSS or a robust vanilla CSS module system.
- Setup testing frameworks (Jest, React Testing Library, Playwright).

### Phase 2: Agentic Backend Development 
- Scaffold Next.js API Routes for the multi-agent pipeline.
- Implement the baseline Orchestrator, Vision, Audio, and text extraction agents using the Google Gemini SDK.
- Connect Google Maps and other relevant APIs.

### Phase 3: Frontend UI Components
- Build the `InputHub`: An accessible dashboard handling drag-and-drop files, voice recording, and text.
- Build the `ActionCards`: Dynamic components to render the structured, step-by-step life-saving plans returned by the Action Planner Agent.
- Implement streaming state management so the user sees agents "thinking" and producing output in real time.

### Phase 4: Integration, Verification & Polish
- Wire the frontend components to the backend agent routes.
- Thoroughly test the modalities (image upload + text prompt + audio recording).
- Perform accessibility audits and performance efficiency profiling.

## Open Questions
1. **Styling Preference**: Do you prefer TailwindCSS for rapid prototyping, or custom plain CSS?
2. **Database/Persistence**: Should we persist the generated actions to a database (e.g., Firebase/Postgres), or can it be an in-memory session for the scope of the challenge?
3. **Libraries**: Are we allowed to use libraries like `@google/genai` or LangChain to expedite the multi-agent architecture, or should the orchestration be written from scratch?
