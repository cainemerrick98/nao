import { useMemo } from 'react';
import { useAgentContext } from '../../contexts/agent.provider';
import { TextShimmer } from '../ui/text-shimmer';
import { Skeleton } from '../ui/skeleton';
import { ToolCallWrapper } from './tool-call-wrapper';
import type { ToolCallComponentProps } from '.';

export const DisplayDatatableToolCall = ({
	toolPart: { state, input, output },
}: ToolCallComponentProps<'display_datatable'>) => {
	const { messages } = useAgentContext();
	const config = state !== 'input-streaming' ? input : undefined;

	const sourceData = useMemo(() => {
		if (!config?.query_id) {
			return null;
		}

		for (const message of messages) {
			for (const part of message.parts) {
				if (part.type === 'tool-execute_sql' && part.output && part.output.id == config.query_id) {
					return part.output;
				}
			}
		}

		return null;
	}, [messages, config?.query_id]);

	if (output && output.error) {
		return (
			<ToolCallWrapper defaultExpanded title='Could not display the datatable'>
				<div className='p-4 text-red-400 text-sm'>{output.error}</div>
			</ToolCallWrapper>
		);
	}

	if (!config) {
		return (
			<div className='my-4 flex flex-col gap-2 items-center aspect-3/2'>
				<Skeleton className='w-1/2 h-4' />
				<Skeleton className='w-full flex-1 flex items-center justify-center gap-2'>
					<TextShimmer text='Loading chart' />
				</Skeleton>
			</div>
		);
	}

	if (!sourceData) {
		return (
			<div className='my-2 text-foreground/50 text-sm'>
				Could not display the chart because the data is missing.
			</div>
		);
	}

	if (!sourceData.data || sourceData.data.length === 0) {
		return (
			<div className='my-2 text-foreground/50 text-sm'>
				Could not display the datatable because the data is empty.
			</div>
		);
	}

	return (
		<div className='flex flex-col items-center my-4 gap-2 aspect-3/2'>
			<div className='relative w-full flex justify-end'>
				<div className='flex items-center gap-1'>
					<DatatableDisplay data={sourceData.data} />
				</div>
			</div>
		</div>
	);
};

export interface DatatableDisplayProps {
	data: Record<string, unknown>[];
}

export const DatatableDisplay = ({ data }: DatatableDisplayProps) => {
	const headers = Object.keys(data[0]);

	return (
		<div className='w-full overflow-auto'>
			<table className='w-full text-sm border-collapse'>
				<thead>
					<tr>
						{headers.map((header) => (
							<th key={header} className='text-left p-2 border-b'>
								{header}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{data.map((row, i) => (
						<tr key={i}>
							{headers.map((header) => (
								<td key={header} className='p-2 border-b'>
									{String(row[header] ?? '')}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
