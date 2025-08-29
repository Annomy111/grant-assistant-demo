import { GrantTemplate } from './template-types';

export const HORIZON_EUROPE_RIA_TEMPLATE: GrantTemplate = {
  id: 'he-ria-2025',
  programType: 'EU_HORIZON',
  actionType: 'RIA',
  name: 'Horizon Europe Research and Innovation Actions (RIA)',
  description: 'Template for Research and Innovation Actions with 100% funding rate',
  language: 'en',
  metadata: {
    fundingRate: 100,
    typicalDuration: '36-48 months',
    typicalBudget: '€2-5 million',
    consortiumRequirements: ['Minimum 3 partners from 3 different EU/Associated countries'],
    trlRange: 'TRL 3-6',
    deadlineInfo: 'Two-stage submission: First stage September 2025, Second stage March 2026'
  },
  keywords: ['research', 'innovation', 'collaboration', 'EU', 'Ukraine'],
  sections: [
    {
      id: 'excellence',
      title: 'Excellence',
      description: 'Objectives, concept, methodology and ambition',
      weight: 50,
      totalWordLimit: 15000,
      pageLimit: 15,
      evaluationCriteria: [
        'Clarity and pertinence of the project objectives',
        'Soundness of the proposed methodology',
        'Credibility of the proposed approach',
        'Extent to which the proposed work is ambitious and goes beyond state-of-art'
      ],
      mandatoryElements: [
        'Clear objectives linked to work programme',
        'State-of-art analysis',
        'Methodology description',
        'Gender dimension analysis',
        'Open science practices'
      ],
      subsections: [
        {
          id: 'objectives',
          title: '1.1 Objectives and ambition',
          description: 'Project objectives aligned with call topic and expected outcomes',
          wordLimit: 3000,
          evaluationCriteria: [
            'Clear link to work programme expected outcomes',
            'Measurable and achievable objectives',
            'Contribution to EU policy objectives'
          ],
          tips: [
            'Start with overall objective, then break down into specific objectives',
            'Use SMART criteria for objectives',
            'Clearly link to Horizon Europe missions and SDGs',
            'Include Ukrainian cooperation benefits'
          ],
          templateContent: `## 1.1 Objectives and ambition

### Overall Objective
The overarching objective of [PROJECT_ACRONYM] is to [MAIN_GOAL], thereby directly contributing to the expected outcomes of [CALL_TOPIC] and advancing [RELEVANT_EU_POLICY].

### Specific Objectives
To achieve this ambitious goal, [PROJECT_ACRONYM] pursues the following specific objectives:

**SO1: [OBJECTIVE_1_TITLE]**
[DESCRIPTION] This objective directly addresses [EXPECTED_OUTCOME_1] by [APPROACH]. The measurable target is [QUANTIFIABLE_TARGET] by [TIMELINE].

**SO2: [OBJECTIVE_2_TITLE]**
[DESCRIPTION] Building on SO1, this objective focuses on [FOCUS_AREA] to achieve [EXPECTED_RESULT]. Success will be measured by [KPI].

**SO3: [OBJECTIVE_3_TITLE]**
[DESCRIPTION] This objective ensures [SUSTAINABILITY_ASPECT] through [METHOD]. The target outcome is [MEASURABLE_OUTCOME].

### Relation to Work Programme
[PROJECT_ACRONYM] directly responds to the call's expected outcomes by:
• [OUTCOME_1]: Our approach of [METHOD] will deliver [RESULT]
• [OUTCOME_2]: Through [APPROACH], we will achieve [IMPACT]
• [OUTCOME_3]: By involving Ukrainian partners, we strengthen [EU_UA_COOPERATION_ASPECT]

### Ambition Beyond State-of-Art
Current solutions in [FIELD] are limited by [CURRENT_LIMITATIONS]. [PROJECT_ACRONYM] goes beyond by:
1. **Innovation in [AREA_1]**: Unlike existing approaches that [CURRENT_APPROACH], we propose [NOVEL_APPROACH]
2. **Breakthrough in [AREA_2]**: We will advance from TRL[CURRENT] to TRL[TARGET] by [METHOD]
3. **Interdisciplinary approach**: Combining [DISCIPLINE_1] with [DISCIPLINE_2] creates unprecedented [SYNERGY]

### EU-Ukraine Cooperation Added Value
The inclusion of Ukrainian partners brings unique advantages:
• Access to [UNIQUE_RESOURCE/EXPERTISE]
• Strengthening research ties post-2022 association
• Contributing to Ukraine's reconstruction through [SPECIFIC_CONTRIBUTION]`,
          fields: [
            {
              id: 'main_goal',
              label: 'Main Project Goal',
              type: 'textarea',
              required: true,
              maxLength: 500,
              placeholder: 'Describe the main goal in one clear sentence',
              helpText: 'This should directly address the call topic'
            },
            {
              id: 'specific_objectives',
              label: 'Specific Objectives',
              type: 'array',
              required: true,
              helpText: 'List 3-5 specific, measurable objectives'
            }
          ]
        },
        {
          id: 'methodology',
          title: '1.2 Methodology',
          description: 'Research methodology, work plan structure and risk mitigation',
          wordLimit: 4000,
          evaluationCriteria: [
            'Soundness of methodology',
            'Appropriate work package structure',
            'Risk assessment and mitigation'
          ],
          templateContent: `## 1.2 Methodology

### Overall Methodological Approach
[PROJECT_ACRONYM] employs a [APPROACH_TYPE] methodology structured in [NUMBER] interconnected Work Packages (WPs):

**Phase 1: Foundation (Months 1-12)**
• WP1: Project Management and Coordination
• WP2: [RESEARCH_ACTIVITY_1]
• WP3: [RESEARCH_ACTIVITY_2]

**Phase 2: Development (Months 13-30)**
• WP4: [DEVELOPMENT_ACTIVITY_1]
• WP5: [DEVELOPMENT_ACTIVITY_2]
• WP6: Validation and Testing

**Phase 3: Implementation (Months 31-48)**
• WP7: Pilot Deployment
• WP8: Evaluation and Optimization
• WP9: Dissemination and Exploitation

### Research Methods and Techniques
Our methodology combines proven and innovative approaches:

**Quantitative Methods:**
• [METHOD_1]: Applied in WP[X] to [PURPOSE]
• [METHOD_2]: Used for [VALIDATION_PURPOSE]
• Statistical analysis using [TOOLS/SOFTWARE]

**Qualitative Methods:**
• [METHOD_3]: Engaging [STAKEHOLDER_GROUPS]
• [METHOD_4]: Ensuring [USER_INVOLVEMENT]
• Co-creation workshops with [TARGET_GROUPS]

### Data Management and Open Science
Following FAIR principles, all data will be:
• **Findable**: Deposited in [REPOSITORY] with DOI
• **Accessible**: Open access after [EMBARGO_PERIOD]
• **Interoperable**: Using [STANDARDS]
• **Reusable**: CC-BY license, documented metadata

### Gender and Ethics Integration
Gender dimension is integrated through:
• Sex/gender analysis in [RESEARCH_AREA]
• Balanced representation in [STUDY_POPULATION]
• Gender-sensitive [METHODOLOGY_ASPECT]

### Risk Management
Key risks and mitigation strategies:

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [RISK_1] | Medium | High | [MITIGATION_1] |
| [RISK_2] | Low | Medium | [MITIGATION_2] |
| Ukrainian partner access limitations | Medium | Medium | Remote collaboration tools, data sharing protocols |`,
          fields: [
            {
              id: 'methodology_type',
              label: 'Methodology Type',
              type: 'select',
              required: true,
              options: ['Mixed Methods', 'Quantitative', 'Qualitative', 'Experimental', 'Action Research'],
              helpText: 'Select primary research approach'
            },
            {
              id: 'work_packages',
              label: 'Work Package Structure',
              type: 'array',
              required: true,
              helpText: 'Define work packages with clear objectives'
            }
          ],
          tips: [
            'Clearly describe the logical flow between work packages',
            'Include specific methods and tools to be used',
            'Address data management according to FAIR principles',
            'Include gender dimension where relevant',
            'Consider Ukraine-specific challenges and mitigation'
          ]
        },
        {
          id: 'state_of_art',
          title: '1.3 Positioning and advancement beyond state-of-art',
          description: 'Current state analysis and proposed advancement',
          wordLimit: 3000,
          templateContent: `## 1.3 State-of-art and advancement

### Current State-of-Art
The field of [DOMAIN] has seen significant developments, particularly in:

**Recent Advances (2023-2025):**
• [ADVANCE_1]: Achieved by [RESEARCH_GROUP] demonstrating [RESULT]
• [ADVANCE_2]: Published in [JOURNAL] showing [FINDING]
• [ADVANCE_3]: EU-funded project [PROJECT_NAME] delivered [OUTCOME]

**Current Limitations:**
Despite progress, critical gaps remain:
1. **Technical Gap**: [DESCRIPTION] limiting [APPLICATION]
2. **Methodological Gap**: Current approaches fail to [LIMITATION]
3. **Geographic Gap**: Limited involvement of Eastern European expertise

### Advancement Beyond State-of-Art
[PROJECT_ACRONYM] advances the field through:

**Scientific Breakthroughs:**
• **Novel Approach to [CHALLENGE]**: We propose [INNOVATION] which overcomes [LIMITATION]
• **First Integration of [TECHNOLOGY_A] with [TECHNOLOGY_B]**: Creating [SYNERGY]
• **Paradigm Shift in [AREA]**: Moving from [OLD_PARADIGM] to [NEW_PARADIGM]

**Technological Innovation:**
• Development of [NOVEL_TECHNOLOGY] achieving [PERFORMANCE_GAIN]%
• TRL advancement from [CURRENT_TRL] to [TARGET_TRL]
• Cost reduction of [PERCENTAGE]% compared to existing solutions

**EU-Ukraine Research Synergy:**
• First systematic collaboration in [SPECIFIC_FIELD]
• Combining Western European [EXPERTISE_1] with Ukrainian [EXPERTISE_2]
• Creating lasting research infrastructure for post-war reconstruction

### Innovation Potential
The project's innovations have transformative potential:
• **Short-term (2026)**: [IMMEDIATE_APPLICATION]
• **Medium-term (2028)**: [MARKET_DEPLOYMENT]
• **Long-term (2030+)**: [SYSTEMIC_CHANGE]`,
          fields: [
            {
              id: 'research_domain',
              label: 'Primary Research Domain',
              type: 'text',
              required: true,
              placeholder: 'e.g., Digital Transformation, Green Technologies',
              helpText: 'Main field of research'
            },
            {
              id: 'trl_current',
              label: 'Current TRL',
              type: 'number',
              required: true,
              helpText: 'Technology Readiness Level at start (1-9)'
            },
            {
              id: 'trl_target',
              label: 'Target TRL',
              type: 'number',
              required: true,
              helpText: 'Expected TRL at project end'
            }
          ]
        }
      ]
    },
    {
      id: 'impact',
      title: 'Impact',
      description: 'Expected impacts, dissemination and exploitation',
      weight: 30,
      totalWordLimit: 10000,
      pageLimit: 10,
      evaluationCriteria: [
        'Contribution to expected outcomes and impacts',
        'Suitable dissemination and exploitation measures',
        'Quality of communication measures',
        'Contribution to EU policy objectives'
      ],
      subsections: [
        {
          id: 'expected_impacts',
          title: '2.1 Project results and expected impacts',
          description: 'Pathways towards impact achievement',
          wordLimit: 3500,
          templateContent: `## 2.1 Expected Impacts

### Contribution to Expected Outcomes
[PROJECT_ACRONYM] directly delivers on call expected outcomes:

**Expected Outcome 1: [OUTCOME_DESCRIPTION]**
• **Project Contribution**: [SPECIFIC_DELIVERABLE/RESULT]
• **Quantifiable Target**: [METRIC] by [TIMELINE]
• **Verification Method**: [HOW_MEASURED]

**Expected Outcome 2: [OUTCOME_DESCRIPTION]**
• **Project Contribution**: [SPECIFIC_DELIVERABLE/RESULT]
• **Target Beneficiaries**: [NUMBER] [TYPE] in [COUNTRIES]
• **Success Indicator**: [KPI]

### Scientific Impact
**Publications and Data:**
• [NUMBER] peer-reviewed publications in high-impact journals
• [NUMBER] open datasets following FAIR principles
• [NUMBER] software tools released as open source

**Capacity Building:**
• Training of [NUMBER] researchers including [NUMBER] from Ukraine
• [NUMBER] PhD theses supported
• Establishment of [INFRASTRUCTURE/LAB] for continued research

### Economic Impact
**Market Creation:**
• Addressable market of €[AMOUNT] by [YEAR]
• Cost savings of €[AMOUNT] for [SECTOR]
• [NUMBER] new products/services developed

**Job Creation:**
• Direct: [NUMBER] research positions during project
• Indirect: [NUMBER] jobs in [SECTORS] by [YEAR]
• Ukraine: [NUMBER] positions supporting reconstruction

### Societal Impact
**Citizens and Communities:**
• [NUMBER] citizens directly benefiting from [SOLUTION]
• Improved [QUALITY_OF_LIFE_ASPECT] for [TARGET_GROUP]
• Contribution to SDG [NUMBER]: [SPECIFIC_CONTRIBUTION]

**Policy Support:**
• Evidence base for [POLICY_AREA]
• Policy briefs for [EU_INSTITUTION]
• Input to [REGULATION/DIRECTIVE]

### Environmental Impact
• CO₂ reduction: [AMOUNT] tons by [YEAR]
• Resource efficiency: [PERCENTAGE]% reduction in [RESOURCE]
• Contribution to European Green Deal: [SPECIFIC_ASPECT]

### Strategic Autonomy and Resilience
• Reduced dependency on [EXTERNAL_FACTOR]
• Strengthened EU-Ukraine cooperation in [STRATEGIC_AREA]
• Enhanced crisis preparedness through [MECHANISM]`,
          fields: [
            {
              id: 'primary_impact',
              label: 'Primary Impact Area',
              type: 'select',
              required: true,
              options: ['Scientific', 'Economic', 'Societal', 'Environmental', 'Policy'],
              helpText: 'Main impact focus of the project'
            },
            {
              id: 'beneficiaries',
              label: 'Target Beneficiaries',
              type: 'array',
              required: true,
              helpText: 'List primary beneficiary groups'
            }
          ]
        },
        {
          id: 'dissemination',
          title: '2.2 Dissemination, exploitation and communication',
          description: 'Strategy for maximizing project impact',
          wordLimit: 3500,
          templateContent: `## 2.2 Dissemination, Exploitation and Communication

### Dissemination Strategy
**Target Audiences and Channels:**

| Audience | Key Messages | Channels | Timeline |
|----------|--------------|----------|----------|
| Scientific Community | Research findings, methodologies | Journals, conferences | Continuous |
| Industry | Innovation potential, applications | Trade fairs, B2B meetings | From M18 |
| Policy Makers | Evidence, recommendations | Policy briefs, workshops | From M24 |
| Civil Society | Benefits, opportunities | Social media, public events | Throughout |

**Key Dissemination Activities:**
• **Scientific Publications**: Minimum [NUMBER] open access papers
• **Conferences**: Presentations at [CONFERENCE_NAMES]
• **Workshops**: [NUMBER] stakeholder workshops including one in Kyiv
• **Training**: [NUMBER] training sessions for [TARGET_GROUPS]

### Exploitation Strategy
**Exploitation Routes:**

**Route 1: Commercial Exploitation**
• Lead: [PARTNER_NAME]
• Product/Service: [DESCRIPTION]
• Business Model: [TYPE]
• Time to Market: [MONTHS] after project end

**Route 2: Further Research**
• Follow-up funding: Application to [PROGRAMME]
• Research Infrastructure: Sustained through [MECHANISM]
• PhD/Postdoc positions: [NUMBER] secured

**Route 3: Policy Uptake**
• Target Institutions: [EU_BODIES], [NATIONAL_MINISTRIES]
• Policy Instruments: [TYPES]
• Engagement Timeline: [PHASES]

### Intellectual Property Management
• **IP Strategy**: [APPROACH - e.g., defensive publishing, patenting]
• **Access Rights**: Defined in Consortium Agreement
• **Open Source**: [COMPONENTS] released under [LICENSE]
• **Data Sharing**: Via [REPOSITORY] under [TERMS]

### Communication Strategy
**Brand and Messaging:**
• Project Identity: Logo, templates, style guide
• Key Messages: [3-5 CORE_MESSAGES]
• Languages: English, German, Ukrainian + [OTHER]

**Communication Channels:**
• **Website**: [PROJECT_WEBSITE] with [FEATURES]
• **Social Media**: LinkedIn, Twitter/X, [OTHER_PLATFORMS]
• **Newsletter**: Quarterly to [NUMBER] subscribers
• **Media**: Press releases at [MILESTONES]

**Success Metrics:**
• Website visitors: [NUMBER] unique visitors/year
• Social media reach: [NUMBER] followers
• Media mentions: [NUMBER] articles
• Event participants: [NUMBER] total

### Ukraine-Specific Dissemination
• Translation of key materials to Ukrainian
• Workshops in Ukrainian cities (hybrid format)
• Collaboration with Ukrainian media outlets
• Integration with reconstruction initiatives`,
          fields: [
            {
              id: 'dissemination_budget',
              label: 'Dissemination Budget',
              type: 'number',
              required: true,
              placeholder: 'Amount in EUR',
              helpText: 'Typically 2-5% of total budget'
            },
            {
              id: 'key_exploitable_results',
              label: 'Key Exploitable Results',
              type: 'array',
              required: true,
              helpText: 'List main results with exploitation potential'
            }
          ]
        }
      ]
    },
    {
      id: 'implementation',
      title: 'Quality and efficiency of implementation',
      description: 'Work plan, consortium, resources and management',
      weight: 20,
      totalWordLimit: 10000,
      pageLimit: 10,
      evaluationCriteria: [
        'Quality and effectiveness of work plan',
        'Capacity and role of participants',
        'Appropriateness of resource allocation'
      ],
      subsections: [
        {
          id: 'work_plan',
          title: '3.1 Work plan and work packages',
          description: 'Detailed work package descriptions, deliverables and milestones',
          wordLimit: 4000,
          templateContent: `## 3.1 Work Plan

### Overall Structure
[PROJECT_ACRONYM] is structured in [NUMBER] Work Packages over [DURATION] months:

### Work Package Descriptions

**WP1: Project Management and Coordination**
• **Lead**: [COORDINATOR_NAME]
• **Duration**: M1-M[END]
• **Person-Months**: [NUMBER]
• **Objectives**:
  - Ensure smooth project execution
  - Financial and administrative management
  - Risk monitoring and quality assurance
• **Deliverables**:
  - D1.1: Project Management Plan (M3)
  - D1.2: Data Management Plan (M6)
  - D1.3-1.6: Periodic Reports
• **Ukrainian Partner Role**: [SPECIFIC_CONTRIBUTION]

**WP2: [TITLE]**
• **Lead**: [PARTNER_NAME]
• **Duration**: M[START]-M[END]
• **Person-Months**: [NUMBER]
• **Objectives**:
  - [OBJECTIVE_1]
  - [OBJECTIVE_2]
  - [OBJECTIVE_3]
• **Tasks**:
  - T2.1: [TASK_DESCRIPTION] (Lead: [PARTNER])
  - T2.2: [TASK_DESCRIPTION] (Lead: [PARTNER])
  - T2.3: [TASK_DESCRIPTION] (Lead: [PARTNER])
• **Deliverables**:
  - D2.1: [DELIVERABLE_TITLE] (M[X])
  - D2.2: [DELIVERABLE_TITLE] (M[Y])
• **Milestones**:
  - MS1: [MILESTONE_DESCRIPTION] (M[X])

### Gantt Chart
[Include visual Gantt chart showing WP timeline and dependencies]

### Deliverables List
| ID | Title | WP | Lead | Type | Dissemination | Due |
|----|-------|-----|------|------|---------------|-----|
| D1.1 | Project Management Plan | 1 | [PARTNER] | Report | Confidential | M3 |
| D2.1 | [TITLE] | 2 | [PARTNER] | [TYPE] | Public | M[X] |

### Milestones List
| ID | Title | Related WPs | Verification | Due |
|----|-------|-------------|--------------|-----|
| MS1 | [TITLE] | WP[X] | [MEANS] | M[X] |
| MS2 | [TITLE] | WP[Y] | [MEANS] | M[Y] |

### Critical Path and Dependencies
• Critical path: WP2 → WP4 → WP7 → WP9
• Key dependencies: [DESCRIPTION]
• Risk mitigation: [MEASURES]`,
          fields: [
            {
              id: 'num_work_packages',
              label: 'Number of Work Packages',
              type: 'number',
              required: true,
              helpText: 'Typically 8-12 for RIA projects'
            },
            {
              id: 'project_duration',
              label: 'Project Duration (months)',
              type: 'number',
              required: true,
              helpText: 'Usually 36-48 months for RIA'
            }
          ]
        },
        {
          id: 'consortium',
          title: '3.2 Consortium capacity',
          description: 'Partner expertise, roles and complementarity',
          wordLimit: 3000,
          templateContent: `## 3.2 Consortium Composition and Capacity

### Consortium Overview
The [PROJECT_ACRONYM] consortium brings together [NUMBER] partners from [NUMBER] countries:

| Partner | Country | Type | Key Expertise | Role |
|---------|---------|------|---------------|------|
| P1 [NAME] (Coordinator) | [COUNTRY] | [TYPE] | [EXPERTISE] | Overall coordination, [TECHNICAL_AREA] |
| P2 [NAME] | [COUNTRY] | [TYPE] | [EXPERTISE] | WP[X] lead, [CONTRIBUTION] |
| P[X] [NAME] | Ukraine | [TYPE] | [EXPERTISE] | [UKRAINIAN_SPECIFIC_CONTRIBUTION] |

### Individual Partner Profiles

**Partner 1: [ORGANIZATION_NAME] (Coordinator)**
• **Profile**: [DESCRIPTION]
• **Key Personnel**:
  - [NAME], [TITLE]: [EXPERTISE], [H-INDEX/PUBLICATIONS]
  - [NAME], [TITLE]: [EXPERTISE], [ACHIEVEMENTS]
• **Infrastructure**: [FACILITIES/EQUIPMENT]
• **Relevant Projects**: [PROJECT_NAMES] demonstrating [CAPABILITY]
• **Role**: Project coordination, lead on [TECHNICAL_ASPECTS]

**Partner [X]: [UKRAINIAN_PARTNER]**
• **Profile**: Leading Ukrainian institution in [FIELD]
• **Unique Contribution**: 
  - Access to [UNIQUE_RESOURCE/DATA]
  - Expertise in [SPECIFIC_AREA]
  - Network of [LOCAL_STAKEHOLDERS]
• **Post-2022 Resilience**: Maintained operations through [MEASURES]
• **EU Cooperation Experience**: [PREVIOUS_PROJECTS]

### Consortium Complementarity
**Geographic Coverage**: 
• Western Europe: [PARTNERS] providing [CONTRIBUTION]
• Eastern Europe: [PARTNERS] ensuring [ASPECT]
• Associated Countries: Ukraine bringing [VALUE]

**Expertise Coverage**:
• Technical: [PARTNER] leads on [TECHNOLOGY]
• Social Sciences: [PARTNER] covers [ASPECT]
• Policy: [PARTNER] ensures [POLICY_LINK]
• End-users: [PARTNER] represents [USER_GROUP]

**Gender Balance**:
• Management: [PERCENTAGE]% female in leadership roles
• Research Team: [PERCENTAGE]% female researchers
• Advisory Board: [PERCENTAGE]% female members

### Third Parties and Subcontracting
• **Associated Partners**: [ORGANIZATIONS] providing [SUPPORT]
• **Subcontracting**: €[AMOUNT] for [SPECIFIC_TASKS]
• **In-kind Contributions**: [DESCRIPTION]

### Consortium Agreement Principles
• IP Management: [APPROACH]
• Decision Making: [STRUCTURE]
• Conflict Resolution: [MECHANISM]
• Ukrainian Partner Contingency: [SPECIAL_PROVISIONS]`,
          fields: [
            {
              id: 'num_partners',
              label: 'Number of Partners',
              type: 'number',
              required: true,
              helpText: 'Minimum 3 for most calls'
            },
            {
              id: 'coordinator_org',
              label: 'Coordinator Organization',
              type: 'text',
              required: true,
              placeholder: 'Lead organization name'
            },
            {
              id: 'ukrainian_partners',
              label: 'Ukrainian Partners',
              type: 'array',
              required: false,
              helpText: 'List Ukrainian participating organizations'
            }
          ]
        },
        {
          id: 'resources',
          title: '3.3 Resources',
          description: 'Budget allocation and justification',
          wordLimit: 2000,
          templateContent: `## 3.3 Resources

### Budget Overview
Total Project Cost: €[TOTAL_AMOUNT]
EU Requested Funding: €[EU_FUNDING] ([PERCENTAGE]%)

### Budget Distribution by Partner
| Partner | Personnel | Equipment | Other Direct | Indirect | Total | Requested |
|---------|-----------|-----------|--------------|----------|--------|-----------|
| P1 (Coord) | €[X] | €[X] | €[X] | €[X] | €[X] | €[X] |
| P2 | €[X] | €[X] | €[X] | €[X] | €[X] | €[X] |
| P[X] (UA) | €[X] | €[X] | €[X] | €[X] | €[X] | €[X] |

### Personnel Costs Justification
**Total Person-Months**: [NUMBER]
• Research Staff: [NUMBER] PM
• Technical Staff: [NUMBER] PM
• Management: [NUMBER] PM

**Key Personnel**:
• Senior Researchers: [NUMBER] × [RATE] = €[AMOUNT]
• Postdocs: [NUMBER] × [RATE] = €[AMOUNT]
• PhD Students: [NUMBER] × [RATE] = €[AMOUNT]

### Equipment and Infrastructure
• **Major Equipment** (>€50k):
  - [EQUIPMENT_1]: €[AMOUNT] - Essential for [PURPOSE]
  - [EQUIPMENT_2]: €[AMOUNT] - Required for [ACTIVITY]
• **Computing Resources**: €[AMOUNT] for [DESCRIPTION]
• **Ukrainian Partner Equipment**: €[AMOUNT] for [RESILIENCE_PURPOSE]

### Other Direct Costs
• **Travel and Subsistence**: €[AMOUNT]
  - Project meetings: €[AMOUNT]
  - Conferences: €[AMOUNT]
  - Ukrainian partner travel support: €[AMOUNT]
• **Consumables**: €[AMOUNT] for [ITEMS]
• **Dissemination**: €[AMOUNT] for publications, events
• **Subcontracting**: €[AMOUNT] for [SERVICES]

### Cost Effectiveness
• Shared resources between WPs reducing duplication
• Open source tools prioritized where appropriate
• Ukrainian partner costs adjusted for local rates
• Economies of scale through [MECHANISM]

### Financial Risk Management
• Budget contingency: [PERCENTAGE]% for unforeseen costs
• Ukrainian partner backup funds for operational continuity
• Currency fluctuation provision for non-Euro partners
• Audit provision: €[AMOUNT]`,
          fields: [
            {
              id: 'total_budget',
              label: 'Total Project Budget (EUR)',
              type: 'number',
              required: true,
              helpText: 'Total cost including all partners'
            },
            {
              id: 'eu_funding_requested',
              label: 'EU Funding Requested (EUR)',
              type: 'number',
              required: true,
              helpText: 'Amount requested from EU (100% for RIA)'
            },
            {
              id: 'person_months_total',
              label: 'Total Person-Months',
              type: 'number',
              required: true,
              helpText: 'Sum of all partner person-months'
            }
          ]
        }
      ]
    }
  ]
};

export const HORIZON_EUROPE_IA_TEMPLATE: GrantTemplate = {
  id: 'he-ia-2025',
  programType: 'EU_HORIZON',
  actionType: 'IA',
  name: 'Horizon Europe Innovation Actions (IA)',
  description: 'Template for Innovation Actions with 70% funding rate',
  language: 'en',
  metadata: {
    fundingRate: 70,
    typicalDuration: '30-36 months',
    typicalBudget: '€3-5 million',
    consortiumRequirements: ['Minimum 3 partners from 3 different EU/Associated countries', 'Strong industry participation'],
    trlRange: 'TRL 5-8',
    deadlineInfo: 'Single-stage submission'
  },
  keywords: ['innovation', 'demonstration', 'pilot', 'market', 'deployment'],
  sections: [] // Similar structure to RIA but with innovation focus
};

export const HORIZON_EUROPE_CSA_TEMPLATE: GrantTemplate = {
  id: 'he-csa-2025',
  programType: 'EU_HORIZON',
  actionType: 'CSA',
  name: 'Horizon Europe Coordination and Support Actions (CSA)',
  description: 'Template for CSA with 100% funding for coordination activities',
  language: 'en',
  metadata: {
    fundingRate: 100,
    typicalDuration: '24-36 months',
    typicalBudget: '€1-2 million',
    consortiumRequirements: ['Can be single beneficiary or consortium'],
    trlRange: 'Not applicable',
    deadlineInfo: 'Various deadlines depending on topic'
  },
  keywords: ['coordination', 'networking', 'policy', 'dissemination', 'support'],
  sections: [] // Simplified structure focusing on coordination
};

// German language template
export const HORIZON_EUROPE_RIA_TEMPLATE_DE: GrantTemplate = {
  ...HORIZON_EUROPE_RIA_TEMPLATE,
  id: 'he-ria-2025-de',
  language: 'de',
  name: 'Horizon Europe Forschungs- und Innovationsmaßnahmen (RIA)',
  description: 'Vorlage für Forschungs- und Innovationsmaßnahmen mit 100% Förderquote',
  // German translations of all sections...
};

// Export all templates
export const HORIZON_TEMPLATES = [
  HORIZON_EUROPE_RIA_TEMPLATE,
  HORIZON_EUROPE_IA_TEMPLATE,
  HORIZON_EUROPE_CSA_TEMPLATE,
  HORIZON_EUROPE_RIA_TEMPLATE_DE
];

export function getTemplateById(id: string): GrantTemplate | undefined {
  return HORIZON_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByLanguage(language: 'de' | 'en' | 'uk'): GrantTemplate[] {
  return HORIZON_TEMPLATES.filter(t => t.language === language);
}

export function getTemplatesByActionType(actionType: string): GrantTemplate[] {
  return HORIZON_TEMPLATES.filter(t => t.actionType === actionType);
}