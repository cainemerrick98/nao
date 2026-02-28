import { memo, useMemo } from 'react';
import { useAgentContext } from '../../contexts/agent.provider';
import { Skeleton } from '../ui/skeleton';
import { ToolCallWrapper } from './tool-call-wrapper';
import type { displayKpi } from '@nao/shared/tools';
import type { ToolCallComponentProps } from '.';

// TODO: Handle adding kpis to stories from chat
export const DisplayKpiToolCall = ({ toolPart: { state, input, output } }: ToolCallComponentProps<'display_kpi'>) => {
	const config = state !== 'input-streaming' ? input : undefined;
	const { messages } = useAgentContext();

	if (output && output.error) {
		return (
			<ToolCallWrapper defaultExpanded title='Could not display the KPI'>
				<div className='p-4 text-red-400 text-sm'>{output.error}</div>
			</ToolCallWrapper>
		);
	}

	if (!config) {
		return (
			<div className='flex flex-wrap gap-2 my-3'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className='flex flex-col gap-2.5 px-4 py-3 rounded-lg border border-white/8 bg-gray-900 w-48'
					>
						<Skeleton className='h-2 w-16' />
						<Skeleton className='h-6 w-12' />
					</div>
				))}
			</div>
		);
	}

	const resolvedKpis = useMemo(
		() =>
			config.kpis.map((kpi) => {
				let value: unknown = null;
				for (const message of messages) {
					for (const part of message.parts) {
						if (part.type === 'tool-execute_sql' && part.output && part.output.id === kpi.query_id) {
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
		[messages, config.kpis],
	);

	return (
		<div className='flex flex-wrap gap-2 my-3'>
			{resolvedKpis.map(({ kpi, value }, index) => (
				<KpiCard key={index} kpi={kpi} value={value} />
			))}
		</div>
	);
};

interface KpiCardProps {
	kpi: displayKpi.Kpi;
	value: unknown;
}

const KpiCard = memo(function KpiCard({ kpi, value }: KpiCardProps) {
	let displayValue: string;
	if (value === null || value === undefined) {
		displayValue = '—';
	} else if (typeof value === 'number' && !Number.isInteger(value)) {
		displayValue = value.toFixed(2);
	} else {
		displayValue = String(value);
	}

	return (
		<div className='flex flex-col justify-between gap-4 w-48 px-5 py-4 rounded-lg border border-white/8 bg-gray-900 hover:bg-gray-800 hover:border-white/15 transition-colors'>
			<span
				title={kpi.display_name}
				className='text-[10px] font-semibold uppercase tracking-widest text-gray-500 truncate cursor-default'
			>
				{kpi.display_name}
			</span>
			<span className='text-3xl font-bold tabular-nums tracking-tight text-white leading-none'>
				{displayValue}
			</span>
		</div>
	);
});
