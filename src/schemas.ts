import { z } from 'zod'

export const signatureSchema = z.object({
  did: z.string().min(1),
  snapshot: z.string().min(1),
  coin_type: z.number(),
  address: z.string().min(1),
  sig: z.string().min(1),
})
export type Signature = z.infer<typeof signatureSchema>

export const proposerLibertyUnitSchema = z.object({
  function: z.string(),
  arguments: z.array(z.unknown()),
})
export type ProposerLibertyUnit = z.infer<typeof proposerLibertyUnitSchema>

export const proposerLibertySetsSchema: z.ZodType<ProposerLibertySets> = z.lazy(
  () =>
    z.union([
      z.object({
        operator: z.enum(['and', 'or']),
        operands: z
          .array(
            z.union([proposerLibertySetsSchema, proposerLibertyUnitSchema]),
          )
          .min(1),
      }),
      z.object({
        operator: z.enum(['not']),
        operands: z
          .array(
            z.union([proposerLibertySetsSchema, proposerLibertyUnitSchema]),
          )
          .length(1),
      }),
    ]),
)
// [index: number]: Omit<VotingPowerUnit, ''> | Omit<VotingPowerSets, ''>
// https://github.com/react-hook-form/react-hook-form/issues/4055
type ProposerLibertyArray = Iterable<
  Omit<ProposerLibertyUnit, ''> | Omit<ProposerLibertySets, ''>
>
export type ProposerLibertySets = {
  operator: 'and' | 'or' | 'not'
  operands: ProposerLibertyArray
}

export const votingPowerUnitSchema = z.object({
  function: z.string(),
  arguments: z.array(z.unknown()),
})
export type VotingPowerUnit = z.infer<typeof votingPowerUnitSchema>

export const votingPowerSetsSchema: z.ZodType<VotingPowerSets> = z.lazy(() =>
  z.union([
    z.object({
      operator: z.enum(['sum', 'max']),
      operands: z
        .array(z.union([votingPowerSetsSchema, votingPowerUnitSchema]))
        .min(1),
    }),
    z.object({
      operator: z.enum(['sqrt']),
      operands: z
        .array(z.union([votingPowerSetsSchema, votingPowerUnitSchema]))
        .length(1),
    }),
  ]),
)
// [index: number]: Omit<VotingPowerUnit, ''> | Omit<VotingPowerSets, ''>
// https://github.com/react-hook-form/react-hook-form/issues/4055
type VotingPowerArray = Iterable<
  Omit<VotingPowerUnit, ''> | Omit<VotingPowerSets, ''>
>
export type VotingPowerSets = {
  operator: 'sum' | 'max' | 'sqrt'
  operands: VotingPowerArray
}

export const workgroupSchema = z.object({
  id: z.string(),
  profile: z.object({
    avatar: z.string().optional(),
    name: z.string().min(1),
    about: z.string().optional(),
  }),
  proposer_liberty: proposerLibertySetsSchema,
  voting_power: votingPowerSetsSchema,
  rules: z.object({
    voting_duration: z.number(),
    voting_start_delay: z.number(),
    approval_condition_description: z.string(),
  }),
})
export type Workgroup = z.infer<typeof workgroupSchema>

export const organizationSchema = z.object({
  profile: z.object({
    avatar: z.string().optional(),
    name: z.string().min(1),
    about: z.string().optional(),
    website: z.string().optional(),
    tos: z.string().optional(),
  }),
  communities: z
    .array(
      z.object({
        type: z.enum(['twitter', 'discord', 'github']),
        value: z.string().min(1),
      }),
    )
    .optional(),
  workgroups: z.array(workgroupSchema).optional(),
  signature: signatureSchema,
})
export type Organization = z.infer<typeof organizationSchema>
