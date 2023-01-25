import { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";

import MembersList from "~/components/members_list";
import type { Member } from "~/components/members_list";
import { db } from "~/utils/db.server"

import styles from "~/styles/compiled.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap" },
	{ rel: "stylesheet", href: styles },
]

type ServerData = {
	members?: Array<Member> | undefined
}

export const action: ActionFunction = async ({
	request
}) => {
	const formData = await request.formData();
	const name = formData.get("member_name") as string;
	const member = formData.get("remove_member") as string;

	if (member) {
		const m: Member = JSON.parse(member);

		await db.member.delete({ where: { id: m.id } })

		const members = await db.member.findMany();

		return json<ServerData>({ members });
	}

	if (!name || !name.trim()) {
		return null;
	}

	await db.member.create({ data: { name } })

	const members = await db.member.findMany();
	
	return json<ServerData>({ members });
}

export const loader: LoaderFunction = async () => {
	const members = await db.member.findMany();

	return json<ServerData>({ members });
}

export default function Index() {
	const loaderData = useLoaderData<ServerData>()
	const fetcher = useFetcher<ServerData>();
	const [members, setMembers] = useState<Array<Member>>([])

	useEffect(() => {
		if (loaderData.members) {
			setMembers(loaderData.members);
			return;
		}

		if (fetcher.data?.members) {
			setMembers(fetcher.data?.members);
			return;
		}
	}, [fetcher.data, loaderData])
	
	const removeMember = (member: Member) => {
		fetcher.submit({ remove_member: JSON.stringify(member) }, { method: "post" });
	}

	return (
		<div className="w-screen bg-indigo-500/90">
			<header className="p-10 flex flex-row justify-center gap-5 border-b border-b-indigo-800">
				<img
					src="https://www.wildcodeschool.com/assets/logo_main-e4f3f744c8e717f1b7df3858dce55a86c63d4766d5d9a7f454250145f097c2fe.png"
					alt="Wild Code School Logo"
					className="w-24 h-10"
				/>
				<span className="font-bold text-3xl text-center text-indigo-800">{"Les Argonautes"}</span>
			</header>

			<fetcher.Form method="post" className="flex flex-col justify-center items-center text-center gap-5 border-b border-b-indigo-800 py-4">
				<span className="text-lg pb-5">{"Ajouter un(e) Argonaute"}</span>

				<label htmlFor="member_name">{"Nom de l'Argonaute"}</label>
				<input
					type="text"
					name="member_name"
					placeholder="Charalampos"
				/>
				<input
					className="app_btn"
					type="submit"
					value="Ajouter"
				/>
			</fetcher.Form>

			<MembersList data={members} removeFn={removeMember} />

			<footer className="flex fixed bottom-0 p-5 w-full bg-indigo-500">
				<span className="w-full text-center font-semibold text-xl text-indigo-800">
					{"Réalisé par Jason en Anthestérion de l'an 515 avant JC"}
					<a href="https://github.com/Snoupix" target="_blank" rel="noreferrer">{" (et Snoupix)"}</a>
				</span>
			</footer>
		</div>
	);
}
