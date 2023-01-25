export type Member = {
	id: string
	name: string
}

export default function MembersList(props: {
	data: Array<Member>,
	removeFn: (member: Member) => void
}) {
	return (
		<div className="mt-4 mb-16 flex flex-col justify-center w-full h-2/6">
			<h2 className="text-xl text-center">{"Membres de l'équipage"}</h2>

			<div className="mt-8 grid justify-center three_cols_grid gap-5 h-44">
				{props.data.map(member => (
					<div className="flex flex-row items-center gap-3" key={member.id}>
						<span className="">{member.name}</span>
						<button className="app_btn text-sm p-1" onClick={() => props.removeFn(member)}>{"Remove"}</button>
					</div>
				))}
			</div>
		</div>
	);
}
