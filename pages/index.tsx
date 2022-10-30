import type { GetServerSideProps, GetServerSidePropsContext, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Divider, Input } from "react-daisyui";
import { DataPicture } from "../interfaces/DataPictures";

const Home = ({ candidates }: { candidates: DataPicture[] }) => {
	const [imageText, setImageText] = useState<string>("");
	const [generatingImage, setGeneratingImage] = useState<boolean>(false);
	const [candidate, setCandidate] = useState({
		imgPreview: {
			x: candidates[0].x,
			y: candidates[0].y,
			img: candidates[0].imgPreview
		},
		img: "",
		type: candidates[0].type,
		index: 0,
	});
	return (
		<div>
			<Head>
				<title>Candidatos</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="">
				<div className="flex flex-col items-center justify-center">
					<Image
						src={candidate.img != "" ? candidate.img : candidate.imgPreview.img}
						className="rounded mx-auto my-2 border"
						alt={"Ola"}
						height="700"
						width="525"
					/>
					<a className={`${generatingImage && "loading"}`}>
						<svg
							aria-hidden="true"
							className={`mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 duration-500 ${
								generatingImage ? "opacity-100" : "opacity-0"
							}`}
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
					</a>
					<div className="mt-2 flex gap-2">
						<label className="input-group">
							<input
								type="text"
								placeholder="..."
								className="input input-bordered"
								onChange={(e) => {
									setImageText(e.target.value);
								}}
							/>
						</label>
						<button
							className="btn btn-primary"
							disabled={imageText == ""}
							onClick={async () => {
								setCandidate((prev) => ({ ...prev, img: "" }));
								let url = `/api/generate?text=${imageText}&image=${candidate.imgPreview.img}&x=${candidate.imgPreview.x}&y=${candidate.imgPreview.y}&type=${candidate.type}`;
								setGeneratingImage(true);
								let request = await fetch(url);
								let data = await request.json();
								setGeneratingImage(false);
								setCandidate((prev) => ({ ...prev, img: data.data as string }))
							}}>
							Gerar imagem
						</button>
						 
						<a
							target={"_blank"}
							className={`btn ${
								candidate.img != "" ? "opacity-100" : "opacity-30"
							}`}
							onClick={() => {
								function forceDownload(url: string, fileName: string) {
									var xhr = new XMLHttpRequest();
									xhr.open("GET", url, true);
									xhr.responseType = "blob";
									xhr.onload = function () {
										var urlCreator = window.URL || window.webkitURL;
										var imageUrl = urlCreator.createObjectURL(this.response);
										var tag = document.createElement("a");
										tag.href = imageUrl;
										tag.download = fileName;
										document.body.appendChild(tag);
										tag.click();
										document.body.removeChild(tag);
									};
									xhr.send();
								}

								forceDownload(candidate.img, "image.png");

								setCandidate({
									img: "",
									index: candidate.index,
									type: candidate.type,
									imgPreview: candidate.imgPreview,
								});
							}}
							href={candidate.img}>
							Baixar Imagem
						</a>
					</div>
				</div>
				<Divider />
				<div className="mt-5">
					<div className="grid grid-cols-3">
						{candidates.map((v, i) => {
							return (
								<div className="flex flex-col mt-1">
									<Image
										src={v.imgPreview}
										className="rounded mx-auto my-2 border"
										alt={"Ola"}
										height="450"
										width="300"
									/>
									<p className="text-left text-2xl w-max mx-auto">
										{v.type.toUpperCase()}
									</p>
									<button
										disabled={candidate.index == i}
										className="btn btn-primary mx-auto mt-2"
										onClick={(button) => {
											setCandidate({
												imgPreview: {
													img: v.imgPreview,
													x: v.x,
													y: v.y
												},
												type: v.type,
												index: i,
												img: "",
											});
										}}>
										{candidate.index == i ? "Selecionado" : "Selecionar"}
									</button>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	res,
}: GetServerSidePropsContext) => {
	let request = await fetch("http://" + req.headers.host + "/api/candidates");
	return {
		props: {
			candidates: await request.json(),
		},
	};
};

export default Home;
