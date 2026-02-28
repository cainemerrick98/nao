import z from 'zod/v3';

export const KpiSchema = z.object({
	query_id: z.string().describe("The id of a previous `execute_sql` tool call's output to get data from."),
	column: z.string().describe('The name of the column in the query that contains the kpi.'),
	display_name: z.string().describe('A short descriptive display name for the KPI'),
});

export const InputSchema = z.object({
	kpis: z.array(KpiSchema).min(1),
});

export const OutputSchema = z.object({
	_version: z.literal('1').optional(),
	success: z.boolean(),
	error: z.string().optional(),
});

export type Kpi = z.infer<typeof KpiSchema>;
export type Input = z.infer<typeof InputSchema>;
export type Output = z.infer<typeof OutputSchema>;
