package com.swaraj.fileshare;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Code {


    @Autowired
    FileRepo repo;
    protected String code_generate(){
        int code;
        Random rand = new Random();
        code = rand.nextInt(10000);
        if(repo.findByCode(String.valueOf(code)) == null)
        {
            if(String.valueOf(code).length()<=3)
            {
                String c;
                do {
                    c = '0' + String.valueOf(code);
                } while(c.length()!=4);
                return c;

            }
            return String.valueOf(code);
        }
        while(repo.findByCode(String.valueOf(code))==null)
        {
            code = (code+3)%10000;
        }
        if(String.valueOf(code).length()<=3) {
            String c;
            do {
                c = '0' + String.valueOf(code);
            } while (c.length() != 4);
            return c;
        }
        return String.valueOf(code);
    }


}
