/* eslint-disable @next/next/no-img-element */
import { ArrowUpDownIcon, ArrowForwardIcon, WarningTwoIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { Tooltip, Select, Button } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import styles from "../styles/Home.module.css";
export interface VerifyPageProps {}

const VerifyPage: React.FC<VerifyPageProps> = () => {
  const handleSubmit = () => {};
  const [id, setID] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className={[styles.content, "min-h-screen flex bg-black"].join(" ")}>
      <div className="relative hidden xl:block xl:w-3/5 h-screen">
        <img className="h-screen" src="./background.png" alt="bg" />
      </div>
      <div className="group xl:w-2/5 rounded-lg mx-12 my-12 xl:ml-16 xl:mr-72 xl:mt-44">
        <div>
          <a href="https://techanalogy.org">
            <Image src="/Logotech.png" width={420} height={150} alt="logo" />
          </a>
          <h2 className="mt-6 text-2xl font-extrabold text-white">
            Not just a certificate but a trusted proof of your skills
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md  shadow-sm">
            <div>
              <p className="sr-only">Certificate ID</p>
              <Tooltip
                label="Enter the email id you registered with"
                aria-label="email"
              >
                <input
                  id="email-address"
                  name="certificateID"
                  type="certificate"
                  required
                  disabled
                  className="appearance-none relative block w-full px-3 py-2 mb-2 bg-transparent border-b-2 border-gray-300 placeholder-gray-500 text-gray-100  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Certificate ID (Coming Soon)"
                  onChange={(e) => setID(e.target.value)}
                />
              </Tooltip>
            </div>
            <div className="flex pt-10">
              {!loading ? (
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  colorScheme="teal"
                  variant="solid"
                  type="submit"
                >
                  Verify Certificate
                </Button>
              ) : (
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  colorScheme="teal"
                  variant="solid"
                  isLoading
                >
                  Verify Certificate
                </Button>
              )}
              <Link href="/" passHref>
                <Button
                  rightIcon={<ArrowBackIcon />}
                  colorScheme="teal"
                  marginLeft={10}
                  variant="outline"
                >
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
