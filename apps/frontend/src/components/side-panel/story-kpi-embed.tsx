import { memo, useMemo } from 'react';
import { useAgentContext } from '@/contexts/agent.provider';
import { KpiCard } from '@/components/tool-calls/display-kpi';

interface KpiBlock {
	queryId: string;
	column: string;
	displayName: string;
}

export const StoryKpiEmbed = memo(function StoryKpiEmbed({ kpis }: { kpis: KpiBlock[] }) {
	const { messages } = useAgentContext();

	const resolvedKpis = useMemo(
		() =>
			kpis.map((kpi) => {
				let value: unknown = null;
				for (const message of messages) {
					for (const part of message.parts) {
						if (part.type === 'tool-execute_sql' && part.output && part.output.id === kpi.queryId) {
							const outputData = part.output.data as Record<string, unknown>[];
							if (outputData.length === 1 && part.output.columns.includes(kpi.column)) {
								value = outputData[0][kpi.column] ?? null;
							}
							break;
						}
					}
				}
				return { kpi, value };
			}),
		[messages, kpis],
	);

	return (
		<div className='flex flex-wrap gap-2 my-3'>
			{resolvedKpis.map(({ kpi, value }, index) => (
				<KpiCard key={index} displayName={kpi.displayName} value={value} />
			))}
		</div>
	);
});
