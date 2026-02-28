import { memo, useMemo } from 'react';
import { useAgentContext } from '../../contexts/agent.provider';
import { TextShimmer } from '../ui/text-shimmer';
import { Skeleton } from '../ui/skeleton';
import { ToolCallWrapper } from './tool-call-wrapper';
import type { displayKpi } from '@nao/shared/tools';
import type { ToolCallComponentProps } from '.';

export const DisplayKpiToolCall = ({ toolPart: { state, input, output } }: ToolCallComponentProps<'display_kpi'>) => {
	const config = state !== 'input-streaming' ? input : undefined;

	const displayType = useMemo(() => {
		if (!config) {
			return null;
		}
		if (!config.display_type) {
			if (config.kpis.length > 1) {
				return 'banner';
			} else {
				return 'card';
			}
		}
		return config.display_type;
	}, [config]);

	if (output && output.error) {
		return (
			<ToolCallWrapper defaultExpanded title='Could not display the KPI'>
				<div className='p-4 text-red-400 text-sm'>{output.error}</div>
			</ToolCallWrapper>
		);
	}

	if (!config) {
		return (
			<div className='my-4 flex flex-col gap-2 items-center aspect-3/2'>
				<Skeleton className='w-1/2 h-4' />
				<Skeleton className='w-full flex-1 flex items-center justify-center gap-2'>
					<TextShimmer text='Loading KPI' />
				</Skeleton>
			</div>
		);
	}

	if (!displayType) {
		return (
			<div className='my-4 flex flex-col gap-2 items-center aspect-3/2'>
				<Skeleton className='w-1/2 h-4' />
				<Skeleton className='w-full flex-1 flex items-center justify-center gap-2'>
					<TextShimmer text='Loading KPI' />
				</Skeleton>
			</div>
		);
	}

	return (
		<div className='flex flex-col items-center my-4 gap-2 aspect-3/2'>
			<div className='relative w-full flex justify-end'>
				<div className='flex items-center gap-1'>
					{displayType === 'banner' ? (
						<div className='flex w-full divide-x rounded-lg border bg-muted/30'>
							{config.kpis.map((kpi, index) => (
								<KpiDisplay key={index} kpi={kpi} display_type='banner' />
							))}
						</div>
					) : (
						<div className='grid w-full gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
							{config.kpis.map((kpi, index) => (
								<KpiDisplay key={index} kpi={kpi} display_type='card' />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export interface KpiDisplayProps {
	kpi: displayKpi.Kpi;
	display_type: string;
}

export const KpiDisplay = memo(function KpiDisplay({ kpi, display_type }: KpiDisplayProps) {
	const { messages } = useAgentContext();

	const sourceValue = useMemo(() => {
		for (const message of messages) {
			for (const part of message.parts) {
				if (part.type === 'tool-execute_sql' && part.output && part.output.id === kpi.query_id) {
					const outputData = part.output.data as Record<string, unknown>[];
					const outputColumns = part.output.columns;

					// Validate
					if (outputData.length !== 1) {
						return null;
					}
					if (!outputColumns.includes(kpi.column)) {
						return null;
					}

					// Extract value
					const row = outputData[0]; // assuming one row per KPI
					return row[kpi.column] ?? null;
				}
			}
		}
		return null;
	}, [messages, kpi]);

	if (sourceValue === null) {
		return (
			<ToolCallWrapper defaultExpanded title='Could not display the KPI'>
				<div className='p-4 text-red-400 text-sm'>{}</div>
			</ToolCallWrapper>
		);
	}

	return (
		<div
			className={
				display_type === 'banner'
					? 'flex-1 px-4 py-3 text-center'
					: 'flex flex-col rounded-lg border bg-background px-4 py-5 shadow-sm'
			}
		>
			<div className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>{kpi.display_name}</div>

			<div className='mt-1 text-2xl font-semibold tabular-nums'>{String(sourceValue)}</div>
		</div>
	);
});
